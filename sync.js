'use strict';
/* Stage 2: sync the whole app state through Supabase (one row per user, last write wins by S.rev).
   Works with the globals from app.js: S, KEY, I18N, ACT, t, esc, render, defaults, showSys, nextSys, toast, tab. */
(() => {
  const CFG = window.LOCKIN_CONFIG || {};
  const META_KEY = 'lockin_sync';
  const TABLE = 'lockin_state';
  let sb = null, user = null, pushT = null, busy = false, again = false;
  let st = { s: 'off', at: 0, err: '' };
  let authMsg = '', authBad = false, authBusy = false, pendingRemote = null;

  Object.assign(I18N.ru, {
    sync: 'Аккаунт и синхронизация', sync_off: 'Синхронизация ещё не настроена: нужен проект Supabase (этап 2).',
    sync_nolib: 'Не загрузилась библиотека синхронизации. Проверь интернет и открой приложение заново.',
    email: 'Почта', password: 'Пароль', signin: 'Войти', signup: 'Создать аккаунт', signout: 'Выйти', sync_now: 'Синхронизировать',
    auth_hint: 'Один аккаунт на телефоне и ПК — данные будут общими. Пароль минимум 6 символов.',
    auth_bad: 'Неверная почта или пароль.', auth_confirm: 'Почта не подтверждена. Открой письмо от Supabase и нажми ссылку.',
    auth_check: 'Аккаунт создан. Если пришло письмо — подтверди почту, потом нажми «Войти».', auth_fill: 'Введи почту и пароль (от 6 символов).',
    signed_as: 'Вход выполнен: {0}', s_syncing: 'Синхронизация…', s_ok: 'Синхронизировано в {0}', s_err: 'Ошибка синхронизации: {0}',
    s_offline: 'Нет интернета. Изменения сохранены на устройстве и уйдут, когда появится сеть.', s_idle: 'Ожидание',
    choose_t: 'Найдены данные в облаке', choose_p: 'В аккаунте уже есть прогресс, и на этом устройстве тоже. Что оставить?',
    use_remote: 'Взять из облака', use_local: 'Оставить с этого устройства', signed_out: 'Ты вышел. Данные остались на устройстве.',
  });
  Object.assign(I18N.en, {
    sync: 'Account and sync', sync_off: 'Sync isn’t set up yet: it needs a Supabase project (stage 2).',
    sync_nolib: 'The sync library didn’t load. Check your connection and reopen the app.',
    email: 'Email', password: 'Password', signin: 'Sign in', signup: 'Create account', signout: 'Sign out', sync_now: 'Sync now',
    auth_hint: 'Use one account on phone and PC to share data. Password: at least 6 characters.',
    auth_bad: 'Wrong email or password.', auth_confirm: 'Email not confirmed. Open the Supabase email and tap the link.',
    auth_check: 'Account created. If you got an email, confirm it, then tap Sign in.', auth_fill: 'Enter your email and a password (6+ characters).',
    signed_as: 'Signed in as {0}', s_syncing: 'Syncing…', s_ok: 'Synced at {0}', s_err: 'Sync error: {0}',
    s_offline: 'Offline. Changes are saved on this device and will upload when you’re back online.', s_idle: 'Waiting',
    choose_t: 'Cloud data found', choose_p: 'This account already has progress, and so does this device. Which one do you keep?',
    use_remote: 'Use cloud data', use_local: 'Keep this device', signed_out: 'Signed out. Your data stays on this device.',
  });

  const meta = () => { try { return JSON.parse(localStorage.getItem(META_KEY)) || {}; } catch (e) { return {}; } };
  const setMeta = m => { try { localStorage.setItem(META_KEY, JSON.stringify(Object.assign(meta(), m))); } catch (e) { /* ignore */ } };
  const writeLocal = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };
  const hm = ms => { const d = new Date(ms); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };

  function statusText() {
    if (st.s === 'syncing') return t('s_syncing');
    if (st.s === 'ok') return t('s_ok', hm(st.at));
    if (st.s === 'offline') return t('s_offline');
    if (st.s === 'err') return t('s_err', st.err);
    return t('s_idle');
  }
  function setStatus(s, err) {
    st = { s, at: s === 'ok' ? Date.now() : st.at, err: err || '' };
    const el = document.getElementById('syncline');
    if (el) { el.textContent = statusText(); el.className = 'note sync-' + s; }
  }

  function applyRemote(data) {
    S = Object.assign(defaults(), data);
    writeLocal();
    setMeta({ rev: S.rev || 0 });
    rollover(true); // the cloud copy may come from a device that hasn't seen today yet
    render();
  }

  async function upload() {
    const rev = S.rev || Date.now();
    if (!S.rev) { S.rev = rev; writeLocal(); }
    const { error } = await sb.from(TABLE).upsert({ user_id: user.id, data: S, updated_at: new Date().toISOString() });
    if (error) throw error;
    setMeta({ rev });
  }

  // pull, compare revisions, then either take the cloud copy or upload ours
  async function syncNow() {
    if (!sb || !user) return;
    if (busy) { again = true; return; }
    busy = true; setStatus('syncing');
    try {
      const { data, error } = await sb.from(TABLE).select('data').eq('user_id', user.id).maybeSingle();
      if (error) throw error;
      const known = meta().rev || 0;
      const localRev = S.rev || 0;
      if (!data) await upload();
      else {
        const remoteRev = (data.data && data.data.rev) || 0;
        if (remoteRev > known) {
          if (localRev > known && localRev > remoteRev) await upload();
          else applyRemote(data.data);
        } else if (localRev > known) await upload();
      }
      setStatus('ok');
    } catch (e) {
      setStatus(navigator.onLine ? 'err' : 'offline', (e && e.message) || String(e));
    } finally {
      busy = false;
      if (again) { again = false; setTimeout(syncNow, 300); }
    }
  }

  async function firstSync() {
    if (!sb || !user) return;
    const m = meta();
    if (m.userId === user.id) { syncNow(); return; }
    try {
      setStatus('syncing');
      const { data, error } = await sb.from(TABLE).select('data').eq('user_id', user.id).maybeSingle();
      if (error) throw error;
      setMeta({ userId: user.id, rev: 0 });
      const localHas = S.xp > 0 || Object.keys(S.days || {}).length > 1 || (S.goals || []).some(g => g.cur > 0);
      if (data && localHas) {
        pendingRemote = data.data;
        showSys({ html: `<div class="win" role="dialog" aria-modal="true"><div class="lbl">${esc(t('g_sys'))}</div><h3>${esc(t('choose_t'))}</h3><p>${esc(t('choose_p'))}</p>
          <div class="form" style="justify-content:center"><button class="btn solid" data-act="syncRemote">${esc(t('use_remote'))}</button><button class="btn ghost" data-act="syncLocal">${esc(t('use_local'))}</button></div></div>` });
        setStatus('ok');
      } else if (data) { applyRemote(data.data); setStatus('ok'); }
      else { await upload(); setStatus('ok'); }
    } catch (e) {
      setStatus(navigator.onLine ? 'err' : 'offline', (e && e.message) || String(e));
    }
  }

  window.syncPush = () => { if (!sb || !user) return; clearTimeout(pushT); pushT = setTimeout(syncNow, 1500); };

  window.syncSection = () => {
    const head = `<div class="ph"><span class="lbl">${esc(t('sync'))}</span></div>`;
    if (!CFG.url || !CFG.key) return `<div class="pn">${head}<div class="note">${esc(t('sync_off'))}</div></div>`;
    if (!sb) return `<div class="pn">${head}<div class="note">${esc(t('sync_nolib'))}</div></div>`;
    if (!user) {
      return `<div class="pn">${head}
        <div class="form" style="margin-top:0">
          <input class="in grow" id="auth-email" type="email" autocomplete="email" placeholder="${esc(t('email'))}" aria-label="${esc(t('email'))}">
          <input class="in grow" id="auth-pass" type="password" autocomplete="current-password" placeholder="${esc(t('password'))}" aria-label="${esc(t('password'))}" minlength="6">
        </div>
        <div class="form"><button class="btn solid" data-act="signin" ${authBusy ? 'aria-busy="true"' : ''}>${esc(t('signin'))}</button><button class="btn ghost" data-act="signup">${esc(t('signup'))}</button></div>
        ${authMsg ? `<div class="note" style="color:${authBad ? 'var(--red)' : 'var(--green)'}">${esc(authMsg)}</div>` : ''}
        <div class="note">${esc(t('auth_hint'))}</div></div>`;
    }
    return `<div class="pn">${head}<div>${esc(t('signed_as', user.email || ''))}</div>
      <div id="syncline" class="note sync-${st.s}">${esc(statusText())}</div>
      <div class="form"><button class="btn" data-act="syncnow">${esc(t('sync_now'))}</button><button class="btn ghost" data-act="signout">${esc(t('signout'))}</button></div></div>`;
  };

  const creds = () => {
    const e = (document.getElementById('auth-email') || {}).value || '';
    const p = (document.getElementById('auth-pass') || {}).value || '';
    return { email: e.trim(), password: p };
  };
  const keepCreds = fn => { // re-render without wiping what was typed
    const c = creds(); fn();
    const e = document.getElementById('auth-email'); const p = document.getElementById('auth-pass');
    if (e) e.value = c.email; if (p) p.value = c.password;
  };
  async function auth(kind) {
    const c = creds();
    if (!c.email || c.password.length < 6) { authMsg = t('auth_fill'); authBad = true; keepCreds(render); return; }
    authBusy = true; authMsg = ''; keepCreds(render);
    try {
      if (kind === 'in') {
        const { error } = await sb.auth.signInWithPassword(c);
        if (error) { authBad = true; authMsg = /confirm/i.test(error.message) ? t('auth_confirm') : (/invalid/i.test(error.message) ? t('auth_bad') : error.message); }
      } else {
        const { data, error } = await sb.auth.signUp({ email: c.email, password: c.password, options: { emailRedirectTo: location.origin + location.pathname } });
        if (error) { authBad = true; authMsg = error.message; }
        else if (!data.session) { authBad = false; authMsg = t('auth_check'); }
      }
    } catch (e) { authBad = true; authMsg = (e && e.message) || String(e); }
    authBusy = false;
    if (!user) keepCreds(render);
  }

  Object.assign(ACT, {
    signin: () => auth('in'),
    signup: () => auth('up'),
    syncnow: () => syncNow(),
    signout: async () => { await sb.auth.signOut(); user = null; setMeta({ userId: null, rev: 0 }); toast(t('signed_out')); render(); },
    syncRemote: () => { if (pendingRemote) applyRemote(pendingRemote); pendingRemote = null; nextSys(); },
    syncLocal: async () => { pendingRemote = null; nextSys(); S.rev = Date.now(); writeLocal(); try { await upload(); setStatus('ok'); } catch (e) { setStatus('err', e.message); } },
  });

  if (!CFG.url || !CFG.key) return;
  if (!window.supabase || !window.supabase.createClient) { if (tab === 'status') render(); return; }
  sb = window.supabase.createClient(CFG.url, CFG.key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  sb.auth.onAuthStateChange((ev, session) => {
    const u = (session && session.user) || null;
    if ((u && u.id) === (user && user.id)) return;
    user = u; authMsg = '';
    if (u) setTimeout(firstSync, 0); // never await Supabase calls inside this callback
    render();
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) syncNow(); });
  window.addEventListener('online', () => syncNow());
  setInterval(syncNow, 60000);
  render();
})();
