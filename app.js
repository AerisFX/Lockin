'use strict';
/* Lock In — daily quests, XP/levels, diary with reminders, focus timer, main goals. Stage 1: data in localStorage. */

const I18N = {
  ru: {
    player: 'Игрок', lvl: 'ур.', rank: 'Ранг', streak: 'серия', days: 'дн.', xp: 'Опыт',
    tab_quests: 'Квесты', tab_diary: 'Дневник', tab_focus: 'Фокус', tab_goals: 'Цели', tab_status: 'Статус',
    daily: 'Ежедневный квест', reset: 'сброс', warn: 'Не выполнишь до сброса: штрафной квест, серия обнулится.',
    penalty: 'Штрафной квест', penalty_hint: 'Не выполнишь сегодня: −50 XP',
    allclear: 'Квест дня выполнен. Серия продолжается.',
    daygoals: 'Цели на день', add_goal_day: 'Новая цель на сегодня', add: 'Добавить', open_diary: 'Открыть дневник',
    nogoals_day: 'Запиши 1–3 главные задачи на день. Укажи время, и придёт напоминание.',
    main_goals: 'Главные цели', left: 'осталось', overdue: 'срок прошёл', no_deadline: 'без срока',
    note: 'Заметка дня', note_ph: 'Что получилось, что нет, что завтра сделать иначе',
    focus_work: 'Фокус', focus_break: 'Перерыв', start: 'Старт', pause: 'Пауза', resume: 'Продолжить', reset_t: 'Сбросить', skip: 'Пропустить',
    focus_today: 'Фокусов сегодня', minutes: 'мин', focus_hint: 'Каждый завершённый фокус: +5 ИНТ. Телефон экраном вниз, уведомления выключены.',
    goal_title: 'Название', goal_target: 'Цель', goal_unit: 'Ед.', goal_deadline: 'Дедлайн', goal_add: 'Новая цель', goal_amount: '+ сколько',
    del: 'Удалить', save: 'Сохранить', edit: 'Изменить', done_btn: 'Готово',
    stats: 'Характеристики', st_str: 'СИЛ', st_int: 'ИНТ', st_end: 'ВЫН', st_dis: 'ДИС',
    st_str_f: 'Сила', st_int_f: 'Интеллект', st_end_f: 'Выносливость', st_dis_f: 'Дисциплина',
    best: 'Рекорд серии', total_xp: 'Всего опыта', perfect_days: 'Идеальных дней', week: 'Последние 7 дней',
    settings: 'Настройки', lang: 'Язык', theme: 'Тема', name: 'Имя', quests_edit: 'Квесты дня', quest_add: 'Добавить квест',
    q_new: 'Новый квест', q_target: 'фокусов', q_kind_focus: 'считать по фокус-таймеру',
    focus_len: 'Фокус, мин', break_len: 'Перерыв, мин', penalty_text: 'Штрафной квест',
    notif: 'Уведомления', notif_on: 'Включить уведомления', notif_ok: 'Уведомления включены',
    notif_no: 'Разрешение не дано. Включи уведомления для сайта в настройках браузера.',
    notif_na: 'Здесь уведомления недоступны. На iPhone сначала добавь приложение на экран «Домой».',
    notif_note: 'Сейчас напоминания приходят, пока приложение открыто. Пуши в фоне подключим на этапе 4.',
    backup: 'Резервная копия', export: 'Скачать копию', import: 'Загрузить копию', imported: 'Данные загружены', bad_file: 'Файл не подошёл. Нужна копия, скачанная из Lock In.',
    sys: 'Уведомление', lvlup: 'Уровень повышен', lvlup_t: 'Новый уровень: {0}. Так держать.',
    pen_new: 'Вчерашний квест не выполнен. Серия обнулена, добавлен штрафной квест.', pen_fail: 'Штрафной квест провален: −50 XP.',
    remind: 'Напоминание', focus_done: 'Фокус завершён: +5 ИНТ. Теперь перерыв.', break_done: 'Перерыв окончен. Готов к следующему фокусу.',
    ok: 'Принято',
    q_wake: 'Подъём до 8:00', q_study: 'Учёба: {0} фокусов', q_sport: 'Спорт 30 минут', q_trade: 'Торговля по правилам', q_sleep: 'Отбой до 23:30',
    q_trade_h: 'или не входил без своего сетапа', q_study_h: '{0} из {1} · таймер во вкладке «Фокус»',
    g_money: '100 000 ₽ к 1 июня', g_essay: 'Сочинение: разобрать произведения', g_unit_works: 'произв.',
    def_penalty: '50 отжиманий и 20 минут чтения',
    go_today: 'Сегодня', confirm_del: 'Нажми ещё раз, чтобы удалить',
    install: 'На iPhone: Safari → Поделиться → На экран «Домой». На ПК: значок установки в адресной строке.',
    saved_local: 'Данные пока хранятся на этом устройстве. Синхронизацию телефона и ПК подключим на этапе 2.',
    win_until: 'до {0}', win_after: 'после {0}', win_opens: 'Откроется в {0}', win_closed: 'Время вышло — квест провален',
    win_lock_t: 'Квест ещё закрыт. Откроется в {0}.', win_closed_t: 'Окно {0} закрыто. Отметить уже нельзя.',
    win_lbl: 'Окно времени', win_note: 'Пустые поля — без ограничений по времени.',
    g_sys: 'Система', g_sync: 'Синхронизация с игроком… 100%', g_welcome: 'С возвращением, {0}.',
    g_quests: 'Ежедневный квест: {0}/{1}. До сброса {2}.', g_clear: 'Ежедневный квест выполнен. Отличная работа.',
    g_pen: 'Внимание: активен штрафной квест.', g_ready: 'Начать день',
    g_new: 'Обнаружен новый игрок.', g_name_q: 'Назови своё имя, чтобы Система его запомнила.',
    name_edit: 'Смена имени', name_ph: 'Имя игрока', confirm: 'Подтвердить',
  },
  en: {
    player: 'Player', lvl: 'lv.', rank: 'Rank', streak: 'streak', days: 'd', xp: 'XP',
    tab_quests: 'Quests', tab_diary: 'Diary', tab_focus: 'Focus', tab_goals: 'Goals', tab_status: 'Status',
    daily: 'Daily quest', reset: 'reset', warn: 'Miss it before the reset: penalty quest and your streak goes to zero.',
    penalty: 'Penalty quest', penalty_hint: 'Fail it today: −50 XP',
    allclear: 'Daily quest complete. Streak continues.',
    daygoals: 'Goals for today', add_goal_day: 'New goal for today', add: 'Add', open_diary: 'Open diary',
    nogoals_day: 'Write down 1–3 key tasks for the day. Add a time to get a reminder.',
    main_goals: 'Main goals', left: 'left', overdue: 'overdue', no_deadline: 'no deadline',
    note: 'Day note', note_ph: 'What worked, what didn’t, what to do differently tomorrow',
    focus_work: 'Focus', focus_break: 'Break', start: 'Start', pause: 'Pause', resume: 'Resume', reset_t: 'Reset', skip: 'Skip',
    focus_today: 'Focus blocks today', minutes: 'min', focus_hint: 'Every finished focus block: +5 INT. Phone face down, notifications off.',
    goal_title: 'Title', goal_target: 'Target', goal_unit: 'Unit', goal_deadline: 'Deadline', goal_add: 'New goal', goal_amount: '+ amount',
    del: 'Delete', save: 'Save', edit: 'Edit', done_btn: 'Done',
    stats: 'Stats', st_str: 'STR', st_int: 'INT', st_end: 'END', st_dis: 'DIS',
    st_str_f: 'Strength', st_int_f: 'Intellect', st_end_f: 'Endurance', st_dis_f: 'Discipline',
    best: 'Best streak', total_xp: 'Total XP', perfect_days: 'Perfect days', week: 'Last 7 days',
    settings: 'Settings', lang: 'Language', theme: 'Theme', name: 'Name', quests_edit: 'Daily quests', quest_add: 'Add quest',
    q_new: 'New quest', q_target: 'blocks', q_kind_focus: 'count with the focus timer',
    focus_len: 'Focus, min', break_len: 'Break, min', penalty_text: 'Penalty quest',
    notif: 'Notifications', notif_on: 'Turn on notifications', notif_ok: 'Notifications are on',
    notif_no: 'Permission was not given. Allow notifications for this site in browser settings.',
    notif_na: 'Notifications aren’t available here. On iPhone, add the app to the Home Screen first.',
    notif_note: 'For now reminders arrive while the app is open. Background push comes in stage 4.',
    backup: 'Backup', export: 'Download backup', import: 'Load backup', imported: 'Data loaded', bad_file: 'That file didn’t work. Use a backup downloaded from Lock In.',
    sys: 'Notice', lvlup: 'Level up', lvlup_t: 'New level: {0}. Keep going.',
    pen_new: 'Yesterday’s quest was not completed. Streak reset, penalty quest added.', pen_fail: 'Penalty quest failed: −50 XP.',
    remind: 'Reminder', focus_done: 'Focus block done: +5 INT. Break time.', break_done: 'Break is over. Ready for the next block.',
    ok: 'Got it',
    q_wake: 'Wake up before 8:00', q_study: 'Study: {0} focus blocks', q_sport: 'Workout 30 minutes', q_trade: 'Trade by the rules', q_sleep: 'Lights out by 23:30',
    q_trade_h: 'or stayed out without my setup', q_study_h: '{0} of {1} · timer in the Focus tab',
    g_money: '100,000 ₽ by June 1', g_essay: 'Essay: study the literary works', g_unit_works: 'works',
    def_penalty: '50 push-ups and 20 minutes of reading',
    go_today: 'Today', confirm_del: 'Tap again to delete',
    install: 'iPhone: Safari → Share → Add to Home Screen. PC: the install icon in the address bar.',
    saved_local: 'Data is stored on this device for now. Phone and PC sync comes in stage 2.',
    win_until: 'before {0}', win_after: 'after {0}', win_opens: 'Opens at {0}', win_closed: 'Time’s up — quest failed',
    win_lock_t: 'This quest is still locked. It opens at {0}.', win_closed_t: 'The {0} window is closed. You can’t tick it anymore.',
    win_lbl: 'Time window', win_note: 'Leave empty for no time limit.',
    g_sys: 'System', g_sync: 'Syncing with player… 100%', g_welcome: 'Welcome back, {0}.',
    g_quests: 'Daily quest: {0}/{1}. Reset in {2}.', g_clear: 'Daily quest complete. Well done.',
    g_pen: 'Warning: a penalty quest is active.', g_ready: 'Start the day',
    g_new: 'New player detected.', g_name_q: 'State your name so the System can remember it.',
    name_edit: 'Change name', name_ph: 'Player name', confirm: 'Confirm',
  },
};

/* Themes: [bg, panel, line, accent, xp, gold, text, muted] */
const THEMES = [
  { id: 1, ru: 'Системный синий', en: 'System blue', c: ['#070B14', '#0D1526', '#1E3A5F', '#3BA4FF', '#9D7BFF', '#FFC857', '#E6F0FF', '#7D8FB0'], cyan: '#7FD8FF' },
  { id: 2, ru: 'Теневой монарх', en: 'Shadow monarch', c: ['#08060D', '#120D1C', '#3A2A5C', '#A970FF', '#D58BFF', '#7FD8FF', '#EDE6FF', '#8A7DA8'] },
  { id: 3, ru: 'Красные врата', en: 'Red gate', c: ['#0B0707', '#160D0E', '#4A1E24', '#FF4757', '#FF8A5B', '#FFC857', '#F5E9E9', '#A58A8C'] },
  { id: 4, ru: 'S-ранг', en: 'S-rank', c: ['#0A0906', '#15120B', '#4A3D1E', '#E8B64C', '#F5D78A', '#7FD8FF', '#F7F0DF', '#A89A78'] },
  { id: 5, ru: 'Ледяной свет', en: 'Ice light', c: ['#F3F7FC', '#FFFFFF', '#C9D9EE', '#1F6FEB', '#7B5CF0', '#D99A14', '#0E1A2B', '#5E7290'], light: true },
  { id: 6, ru: 'Изумрудный код', en: 'Emerald code', c: ['#050C09', '#0A1611', '#1C4434', '#2EE59D', '#7CF5C8', '#E6D36A', '#E3FFF3', '#7BA494'] },
  { id: 7, ru: 'Северное сияние', en: 'Aurora', c: ['#060A12', '#0C1421', '#203750', '#3DE0D0', '#B57BFF', '#FFD27A', '#E8F6FF', '#7F97AE'] },
  { id: 8, ru: 'Киберпанк', en: 'Cyberpunk', c: ['#09070F', '#130F1E', '#3A2450', '#FF3EA5', '#33E1FF', '#FFE14D', '#F7E9FF', '#9C86B3'] },
  { id: 9, ru: 'Закат', en: 'Sunset', c: ['#0E0807', '#1A100D', '#4A2A1E', '#FF8A3D', '#FF4F7B', '#FFD166', '#FFF1E8', '#AE8E80'] },
  { id: 10, ru: 'Арктика', en: 'Arctic', c: ['#0C0E11', '#15181D', '#2C333D', '#DCE7F5', '#8FB8FF', '#F2C46B', '#F4F7FB', '#8590A0'] },
  { id: 11, ru: 'Океан', en: 'Ocean', c: ['#04111A', '#08202E', '#164059', '#22C3E6', '#4F8CFF', '#FFC857', '#E2F6FF', '#72A0B5'] },
  { id: 12, ru: 'Кровавая луна', en: 'Blood moon', c: ['#0A0507', '#160B0F', '#3F1A24', '#E0475E', '#C9CDD6', '#E8B04C', '#F6EBEE', '#9D8189'] },
  { id: 13, ru: 'Сакура', en: 'Sakura', c: ['#0D0A10', '#18121D', '#3B2C47', '#FF9CC7', '#B9A2FF', '#FFD6A0', '#FBEFFA', '#A895B0'] },
  { id: 14, ru: 'Молния', en: 'Lightning', c: ['#09090A', '#141415', '#353520', '#F5E642', '#4DD8FF', '#FF9F43', '#F7F6E8', '#9A988A'] },
  { id: 15, ru: 'Хаки', en: 'Khaki', c: ['#0A0C08', '#141810', '#343D26', '#B5C96A', '#E2C78A', '#F0A04B', '#EFF1E4', '#939A80'] },
];
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, w) => '#' + rgb(a).map((v, i) => Math.round(v + (rgb(b)[i] - v) * w).toString(16).padStart(2, '0')).join('');
function applyTheme() {
  const th = THEMES.find(x => x.id === S.theme) || THEMES[9];
  const [bg, pn, ln, a, xp, gd, tx, mu] = th.c;
  const v = {
    '--bg': bg, '--panel': pn, '--panel-2': mix(pn, a, th.light ? 0.02 : 0.05), '--line': ln, '--line-soft': mix(pn, ln, 0.5),
    '--blue': a, '--cyan': th.cyan || xp, '--mana': xp, '--gold': gd, '--tx': tx, '--mu': mu,
    '--red': th.light ? '#D92D4A' : '#FF4D6A', '--green': th.light ? '#12A150' : '#4ADE9B',
    '--acc-rgb': rgb(a).join(','), '--bg-rgb': rgb(bg).join(','),
  };
  const st = document.documentElement.style;
  Object.entries(v).forEach(([k, val]) => st.setProperty(k, val));
  st.setProperty('color-scheme', th.light ? 'light' : 'dark');
  const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', bg);
}

const STATS = ['str', 'int', 'end', 'dis'];
const KEY = 'lockin_v1';
const uid = () => Math.random().toString(36).slice(2, 10);

function defaults() {
  return {
    v: 1, lang: 'ru', theme: 10, name: 'Даня', xp: 0, statXP: { str: 0, int: 0, end: 0, dis: 0 },
    streak: 0, best: 0, perfect: 0, lastDay: '',
    quests: [
      { id: 'wake', key: 'q_wake', stat: 'end', xp: 20, from: '05:00', to: '08:00' },
      { id: 'study', key: 'q_study', stat: 'int', xp: 30, focus: true, target: 6 },
      { id: 'sport', key: 'q_sport', stat: 'str', xp: 20 },
      { id: 'trade', key: 'q_trade', hint: 'q_trade_h', stat: 'dis', xp: 25 },
      { id: 'sleep', key: 'q_sleep', stat: 'end', xp: 20, from: '22:00', to: '23:30' },
    ],
    goals: [
      { id: 'money', key: 'g_money', cur: 0, target: 100000, unit: '₽', deadline: '2027-06-01', color: 'gold' },
      { id: 'essay', key: 'g_essay', cur: 0, target: 5, unitKey: 'g_unit_works', deadline: '2026-12-02', color: 'blue' },
    ],
    days: {},
    settings: { focus: 25, brk: 5, penalty: '' },
    timer: { mode: 'work', endAt: 0, remain: 0, running: false },
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const d = JSON.parse(raw); return Object.assign(defaults(), d); }
  } catch (e) { /* storage blocked */ }
  return defaults();
}
let S = load();
// A user change bumps the revision (sync.js uses it to pick the newer copy) and schedules an upload.
// sys = true is for bookkeeping the app does by itself (day rollover, greeting, reminders): stored locally only,
// so a stale device opening the app can't outrank fresher data from the other device.
let lastBody = '';
const save = sys => {
  if (!sys) {
    const body = JSON.stringify(Object.assign({}, S, { rev: 0 }));
    if (body !== lastBody) { lastBody = body; S.rev = Date.now(); if (window.syncPush) window.syncPush(); }
  }
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
};

const t = (k, ...a) => { let s = (I18N[S.lang] && I18N[S.lang][k]) || I18N.ru[k] || k; a.forEach((v, i) => { s = s.replace('{' + i + '}', v); }); return s; };
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const keyOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayKey = () => keyOf(new Date());
const parseKey = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (k, n) => { const d = parseKey(k); d.setDate(d.getDate() + n); return keyOf(d); };
const fmtNum = n => Math.round(n).toLocaleString(S.lang === 'ru' ? 'ru-RU' : 'en-US');
const locale = () => (S.lang === 'ru' ? 'ru-RU' : 'en-US');

function day(k) {
  if (!S.days[k]) S.days[k] = { done: {}, focus: 0, goals: [], note: '', penalty: null };
  return S.days[k];
}
const qTitle = q => q.key ? t(q.key, q.target) : q.title;
const gTitle = g => g.key ? t(g.key) : g.title;
const gUnit = g => g.unitKey ? t(g.unitKey) : (g.unit || '');
const qDone = (q, D) => !!D.done[q.id] || (q.focus && (D.focus || 0) >= (q.target || 1));

/* Time windows: a quest with from/to can be ticked only inside [from, to). Before -> locked, after -> failed. */
const nowHM = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
function winState(q) {
  if (q.focus || (!q.from && !q.to)) return 'open';
  const hm = nowHM(), from = q.from || '00:00', to = q.to || '24:00';
  if (from <= to) return hm < from ? 'lock' : (hm >= to ? 'closed' : 'open');
  return (hm >= from || hm < to) ? 'open' : 'lock'; // window across midnight
}
function winLabel(q) {
  if (q.focus || (!q.from && !q.to)) return '';
  if (!q.from) return t('win_until', q.to);
  if (!q.to) return t('win_after', q.from);
  return `${q.from}–${q.to}`;
}
// one-time: give the two default timed quests their windows for data saved before windows existed
if (!S.winMigrated) {
  S.quests.forEach(q => {
    if (q.id === 'wake' && !q.from && !q.to) { q.from = '05:00'; q.to = '08:00'; }
    if (q.id === 'sleep' && !q.from && !q.to) { q.from = '22:00'; q.to = '23:30'; }
  });
  S.winMigrated = true; delete S.winInit; save(true);
}

/* XP & levels */
const need = n => 80 + 20 * n; // XP to go from level n to n+1
function lvlInfo(xp) { let n = 1, left = xp; while (left >= need(n)) { left -= need(n); n++; } return { lvl: n, into: left, need: need(n) }; }
const rankOf = l => l >= 50 ? 'S' : l >= 35 ? 'A' : l >= 20 ? 'B' : l >= 10 ? 'C' : l >= 5 ? 'D' : 'E';
const statVal = s => 10 + Math.floor((S.statXP[s] || 0) / 50);

function award(stat, amount) {
  const before = lvlInfo(S.xp).lvl;
  S.xp = Math.max(0, S.xp + amount);
  if (stat) S.statXP[stat] = Math.max(0, (S.statXP[stat] || 0) + amount);
  const after = lvlInfo(S.xp).lvl;
  if (after > before) { flash(); sysWin(t('lvlup'), t('lvlup_t', after)); }
}

/* Day rollover: evaluate every finished day since the last visit */
function rollover(quiet) {
  const tk = todayKey();
  if (!S.lastDay) { S.lastDay = tk; save(true); return []; }
  const msgs = [];
  let k = S.lastDay;
  let guard = 0;
  while (k < tk && guard++ < 400) {
    const D = day(k);
    const allQ = S.quests.every(q => qDone(q, D));
    const penOk = !D.penalty || D.penalty.done;
    if (D.penalty && !D.penalty.done) { S.xp = Math.max(0, S.xp - 50); msgs.push(t('pen_fail')); }
    if (allQ && penOk) { S.streak++; S.perfect++; S.best = Math.max(S.best, S.streak); D.perfect = true; }
    else {
      S.streak = 0; D.perfect = false;
      const N = day(addDays(k, 1));
      if (!N.penalty) N.penalty = { text: S.settings.penalty || t('def_penalty'), done: false };
      if (addDays(k, 1) === tk) msgs.push(t('pen_new'));
    }
    k = addDays(k, 1);
  }
  S.lastDay = tk;
  save(true);
  const uniq = [...new Set(msgs)];
  if (uniq.length && !quiet) sysWin(t('penalty'), uniq.join(' '), true);
  return uniq;
}

/* ---------- UI helpers ---------- */
const ICON = {
  quests: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2"/>',
  diary: '<path d="M6 4h11a2 2 0 0 1 2 2v14H8a2 2 0 0 1-2-2V4zM6 18a2 2 0 0 1 2-2h11M10 8h6M10 11h4"/>',
  focus: '<path d="M6.5 7h11M6.5 17h11M6 20v-2a6 6 0 1 1 12 0v2M6 4v2a6 6 0 1 0 12 0V4M5 4h14M5 20h14"/>',
  goals: '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="9"/>',
  status: '<circle cx="12" cy="7" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  bell: '<path d="M10 5a2 2 0 1 1 4 0 7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6M9 17v1a3 3 0 0 0 6 0v-1"/>',
  alert: '<path d="M12 9v4M12 17h.01M10.4 3.9 2.6 17.5A1.9 1.9 0 0 0 4.2 20.4h15.6a1.9 1.9 0 0 0 1.6-2.9L13.6 3.9a1.9 1.9 0 0 0-3.2 0z"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  left: '<path d="M15 6l-6 6 6 6"/>', right: '<path d="M9 6l6 6-6 6"/>',
};
const ic = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;
const ck = (on, act, id, extra = '') => `<button class="ck ${on ? 'on' : ''}" data-act="${act}" data-id="${esc(id)}" ${extra} aria-pressed="${on}" aria-label="toggle">${ic('check')}</button>`;

let tab = 'quests';
let diaryDay = todayKey();
let editGoal = null;

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast'; el.textContent = msg; el.setAttribute('role', 'status');
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}
/* System windows are queued so a greeting, a penalty and a level-up never overwrite each other */
const sysQ = [];
let sysOpen = false;
function showSys(w) { sysQ.push(w); if (!sysOpen) nextSys(); }
function nextSys() {
  const box = document.getElementById('sys');
  const w = sysQ.shift();
  if (!w) { box.hidden = true; box.innerHTML = ''; sysOpen = false; return; }
  sysOpen = true;
  box.innerHTML = w.html; box.hidden = false;
  if (w.after) w.after(box);
  const f = box.querySelector('input') || box.querySelector('button'); if (f) f.focus();
}
function sysWin(title, text, red) {
  showSys({ html: `<div class="win ${red ? 'red' : ''}" role="dialog" aria-modal="true"><div class="lbl">${esc(t('sys'))}</div><h3>${esc(title)}</h3><p>${esc(text)}</p><button class="btn solid" data-act="sysclose">${esc(t('ok'))}</button></div>` });
}
function typeLines(box, lines) {
  const wrap = box.querySelector('.type'); if (!wrap) return;
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ps = lines.map(() => { const p = document.createElement('p'); wrap.appendChild(p); return p; });
  if (reduce) { ps.forEach((p, i) => { p.textContent = lines[i]; }); return; }
  let li = 0, ci = 0;
  const step = () => {
    if (!wrap.isConnected) return;
    if (li >= lines.length) { ps[ps.length - 1].classList.add('cur'); return; }
    ps.forEach(p => p.classList.remove('cur')); ps[li].classList.add('cur');
    ps[li].textContent = lines[li].slice(0, ++ci);
    if (ci >= lines[li].length) { li++; ci = 0; setTimeout(step, 320); } else setTimeout(step, 28);
  };
  wrap.addEventListener('click', () => { li = lines.length; ps.forEach((p, i) => { p.textContent = lines[i]; }); });
  setTimeout(step, 350);
}
function greeting(extra) {
  const D = day(todayKey());
  const done = S.quests.filter(q => qDone(q, D)).length;
  const lines = [t('g_sync'), t('g_welcome', S.name),
    done >= S.quests.length ? t('g_clear') : t('g_quests', done, S.quests.length, resetIn())];
  if (D.penalty && !D.penalty.done) lines.push(t('g_pen'));
  (extra || []).forEach(m => lines.push(m));
  showSys({
    html: `<div class="win greet ${D.penalty && !D.penalty.done ? 'red' : ''}" role="dialog" aria-modal="true"><div class="lbl">${esc(t('g_sys'))}</div><div class="type"></div>
      <button class="btn solid" data-act="sysclose">${esc(t('g_ready'))}</button></div>`,
    after: box => typeLines(box, lines),
  });
  S.greetDay = todayKey(); save(true);
}
function namePrompt(first) {
  showSys({
    html: `<div class="win greet" role="dialog" aria-modal="true"><div class="lbl">${esc(t('g_sys'))}</div>
      <h3>${esc(first ? t('g_new') : t('name_edit'))}</h3><p>${esc(t('g_name_q'))}</p>
      <form data-form="name" class="form" style="justify-content:center"><input class="in grow" id="name-in" name="name" maxlength="24" value="${esc(S.name)}" placeholder="${esc(t('name_ph'))}" required autocomplete="nickname">
      <button class="btn solid" type="submit">${esc(t('confirm'))}</button></form></div>`,
  });
}
function flash() { document.body.classList.remove('flash'); void document.body.offsetWidth; document.body.classList.add('flash'); setTimeout(() => document.body.classList.remove('flash'), 1000); }
function floatXP(rect, text) {
  if (!rect) return;
  const el = document.createElement('div'); el.className = 'xpf'; el.textContent = text;
  el.style.left = `${rect.left + rect.width / 2}px`; el.style.top = `${rect.top - 4}px`;
  document.body.appendChild(el); setTimeout(() => el.remove(), 1100);
}
function popCheck(sel) { const el = document.querySelector(sel); if (el) el.classList.add('pop'); }

/* ---------- Render ---------- */
function renderNav() {
  const tabs = ['quests', 'diary', 'focus', 'goals', 'status'];
  document.getElementById('nav').innerHTML = `<div class="brand">LOCK IN</div>` +
    tabs.map(n => `<button class="${tab === n ? 'on' : ''}" data-act="tab" data-id="${n}" aria-current="${tab === n ? 'page' : 'false'}">${ic(n)}<span>${esc(t('tab_' + n))}</span></button>`).join('');
}

function renderHeader() {
  const L = lvlInfo(S.xp);
  const D = day(todayKey());
  const live = S.streak + (S.quests.every(q => qDone(q, D)) && (!D.penalty || D.penalty.done) ? 1 : 0);
  document.getElementById('hdr').innerHTML = `
    <div class="hrow">
      <div><div class="lbl">${esc(t('player'))}</div>
        <div class="who"><button class="namebtn" data-act="name" title="${esc(t('name_edit'))}">${esc(S.name)}</button> · ${esc(t('lvl'))} ${L.lvl}<span class="rank">${esc(t('rank'))} ${rankOf(L.lvl)}</span></div></div>
      <div style="display:grid;gap:6px;justify-items:end">
        <div class="seg mini" role="group" aria-label="${esc(t('lang'))}"><button class="${S.lang === 'ru' ? 'on' : ''}" data-act="setlang" data-id="ru" aria-pressed="${S.lang === 'ru'}">RU</button><button class="${S.lang === 'en' ? 'on' : ''}" data-act="setlang" data-id="en" aria-pressed="${S.lang === 'en'}">EN</button></div>
        <div class="streak num">${live} ${esc(t('days'))}<small>${esc(t('streak'))}</small></div>
      </div>
    </div>
    <div class="hrow small mu"><span>${esc(t('xp'))}</span><span class="num">${L.into} / ${L.need} XP</span></div>
    <div class="bar xp"><i data-k="xp" style="width:${Math.min(100, L.into / L.need * 100)}%"></i></div>`;
}

const statsStrip = () => `<div class="pn"><div class="stats">${STATS.map(s => `<div><span>${esc(t('st_' + s))}</span><b>${statVal(s)}</b></div>`).join('')}</div></div>`;

function resetIn() {
  const n = new Date(); const m = new Date(n); m.setHours(24, 0, 0, 0);
  const s = Math.max(0, Math.floor((m - n) / 1000));
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s % 3600 / 60))}:${pad(s % 60)}`;
}

function questsPanel() {
  const D = day(todayKey());
  const all = S.quests.every(q => qDone(q, D)) && (!D.penalty || D.penalty.done);
  const pen = D.penalty ? `<div class="pn red"><div class="ph"><span class="lbl">${esc(t('penalty'))}</span><span class="small" style="color:var(--red)">${esc(t('penalty_hint'))}</span></div>
      <div class="it ${D.penalty.done ? 'done' : ''}">${ck(D.penalty.done, 'pen', 'p')}<div class="tt"><span>${esc(D.penalty.text)}</span></div></div></div>` : '';
  const rows = S.quests.map(q => {
    const on = qDone(q, D);
    const ws = winState(q);
    const wl = winLabel(q);
    let hint = q.focus ? t('q_study_h', Math.min(D.focus || 0, q.target), q.target) : (q.hint ? t(q.hint) : '');
    let cls = on ? 'done' : '';
    let box = ck(on, 'quest', q.id);
    if (!on && ws === 'lock') { cls = 'lock'; hint = t('win_opens', q.from || '00:00'); box = `<button class="ck lockd" data-act="quest" data-id="${q.id}" aria-label="${esc(hint)}">${ic('lock')}</button>`; }
    if (!on && ws === 'closed') { cls = 'fail'; hint = t('win_closed'); box = `<button class="ck faild" data-act="quest" data-id="${q.id}" aria-label="${esc(hint)}">${ic('x')}</button>`; }
    const win = wl ? `<span class="win-t ${ws}">${ic('clock')}${esc(wl)}</span>` : '';
    return `<div class="it ${cls}">${box}<div class="tt"><span>${esc(qTitle(q))}</span>${hint || win ? `<small>${win}${hint && win ? ' · ' : ''}${esc(hint)}</small>` : ''}</div><span class="rw ${on ? 'on' : ''}">+${q.xp} ${esc(t('st_' + q.stat))}</span></div>`;
  }).join('');
  return `${pen}<div class="pn"><div class="ph"><span class="lbl">${esc(t('daily'))}</span><span class="small mu">${esc(t('reset'))} <span class="num" id="resetIn">${resetIn()}</span></span></div>
    <div class="list">${rows}</div>
    ${all ? `<div class="ok">${esc(t('allclear'))}</div>` : `<div class="warn">${ic('alert').replace('<svg', '<svg width="14" height="14"')}<span>${esc(t('warn'))}</span></div>`}</div>`;
}

function dayGoalRows(k, compact) {
  const D = day(k);
  if (!D.goals.length) return `<div class="empty">${esc(t('nogoals_day'))}</div>`;
  const list = [...D.goals].sort((a, b) => (a.time || '99') < (b.time || '99') ? -1 : 1);
  return list.map(g => `<div class="it ${g.done ? 'done' : ''}">${ck(g.done, 'dg', g.id, `data-day="${k}"`)}<div class="tt"><span>${esc(g.text)}</span></div>
    ${g.time ? `<span class="tm">${ic('bell')}${esc(g.time)}</span>` : ''}${compact ? '' : `<button class="x" data-act="dgdel" data-id="${g.id}" data-day="${k}" aria-label="${esc(t('del'))}">${ic('x')}</button>`}</div>`).join('');
}

function goalAddForm(k, id) {
  return `<form class="form" data-form="dg" data-day="${k}"><input class="in grow" id="${id}" name="text" maxlength="120" placeholder="${esc(t('add_goal_day'))}" required>
    <input class="in w80" type="time" name="time" id="${id}-t" aria-label="time"><button class="btn" type="submit">${esc(t('add'))}</button></form>`;
}

function mainGoalRows(withControls) {
  if (!S.goals.length) return `<div class="empty">—</div>`;
  return S.goals.map(g => {
    const p = g.target ? Math.min(100, g.cur / g.target * 100) : 0;
    let dl = t('no_deadline');
    if (g.deadline) { const d = Math.ceil((parseKey(g.deadline) - parseKey(todayKey())) / 864e5); dl = d >= 0 ? `${d} ${t('days')} ${t('left')}` : t('overdue'); }
    const unit = gUnit(g);
    if (withControls && editGoal === g.id) {
      return `<div class="goal"><form class="form" data-form="gedit" data-id="${g.id}" style="margin-top:0">
        <input class="in grow" name="title" id="ge-title" value="${esc(gTitle(g))}" required aria-label="${esc(t('goal_title'))}">
        <input class="in w80" name="target" id="ge-target" type="number" min="1" step="any" value="${g.target}" aria-label="${esc(t('goal_target'))}">
        <input class="in w80" name="unit" id="ge-unit" value="${esc(unit)}" aria-label="${esc(t('goal_unit'))}">
        <input class="in" name="deadline" id="ge-dl" type="date" value="${g.deadline || ''}" aria-label="${esc(t('goal_deadline'))}">
        <button class="btn solid" type="submit">${esc(t('save'))}</button>
        <button class="btn danger" type="button" data-act="gdel" data-id="${g.id}">${esc(t('del'))}</button></form></div>`;
    }
    return `<div class="goal"><div class="gh"><span>${esc(gTitle(g))}</span><span class="small mu num">${fmtNum(g.cur)} / ${fmtNum(g.target)} ${esc(unit)}</span></div>
      <div class="bar ${g.color === 'gold' ? 'gold' : ''}"><i data-k="g-${g.id}" style="width:${p}%"></i></div>
      <div class="hrow small mu" style="margin-top:5px"><span class="num">${Math.round(p)}%</span><span>${esc(dl)}</span></div>
      ${withControls ? `<form class="form" data-form="gadd" data-id="${g.id}"><input class="in w80" name="amt" id="ga-${g.id}" type="number" step="any" placeholder="${esc(t('goal_amount'))}" aria-label="${esc(t('goal_amount'))}" required>
        <button class="btn" type="submit">${esc(t('add'))}</button><button class="btn ghost" type="button" data-act="gedit" data-id="${g.id}">${esc(t('edit'))}</button></form>` : ''}</div>`;
  }).join('');
}

function viewQuests() {
  const k = todayKey();
  return `<div class="home"><div>${statsStrip()}${questsPanel()}</div><div>
    <div class="pn"><div class="ph"><span class="lbl">${esc(t('daygoals'))}</span><button class="link" data-act="tab" data-id="diary">${esc(t('open_diary'))}</button></div>
      <div class="list">${dayGoalRows(k, true)}</div>${goalAddForm(k, 'qg-in')}</div>
    <div class="pn"><div class="ph"><span class="lbl">${esc(t('main_goals'))}</span><button class="link" data-act="tab" data-id="goals">→</button></div>${mainGoalRows(false)}</div>
  </div></div>`;
}

function viewDiary() {
  const k = diaryDay; const D = day(k);
  const label = parseKey(k).toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' });
  return `<div class="pn"><div class="daynav">
      <button class="btn ghost" data-act="dprev" aria-label="prev">${ic('left').replace('<svg', '<svg width="16" height="16"')}</button>
      <div class="d">${esc(label)}</div>
      <button class="btn ghost" data-act="dnext" aria-label="next">${ic('right').replace('<svg', '<svg width="16" height="16"')}</button></div>
      ${k !== todayKey() ? `<div style="text-align:center;margin-top:8px"><button class="link" data-act="dtoday">${esc(t('go_today'))}</button></div>` : ''}</div>
    <div class="pn"><div class="ph"><span class="lbl">${esc(t('daygoals'))}</span></div><div class="list">${dayGoalRows(k, false)}</div>${goalAddForm(k, 'dg-in')}</div>
    <div class="pn"><div class="ph"><span class="lbl">${esc(t('note'))}</span></div>
      <textarea class="in" id="note-${k}" data-ch="note" data-day="${k}" placeholder="${esc(t('note_ph'))}">${esc(D.note)}</textarea></div>`;
}

function timerLeft() {
  const T = S.timer;
  const full = (T.mode === 'work' ? S.settings.focus : S.settings.brk) * 60000;
  if (T.running) return Math.max(0, T.endAt - Date.now());
  return T.remain > 0 ? T.remain : full;
}
function viewFocus() {
  const T = S.timer; const D = day(todayKey());
  const full = (T.mode === 'work' ? S.settings.focus : S.settings.brk) * 60000;
  const left = timerLeft(); const f = 1 - left / full;
  const sq = S.quests.find(q => q.focus); const target = sq ? sq.target : 6;
  const pips = Array.from({ length: Math.max(target, D.focus || 0) }, (_, i) => `<i class="${i < (D.focus || 0) ? 'on' : ''}"></i>`).join('');
  const C = 2 * Math.PI * 54;
  return `<div class="pn"><div class="timer"><div class="ring ${T.mode === 'break' ? 'brk' : ''}">
      <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="none" style="stroke:var(--line-soft)" stroke-width="6"/>
      <circle id="ringArc" cx="60" cy="60" r="54" fill="none" stroke-width="6" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - f)}" style="stroke:${T.mode === 'work' ? 'var(--blue)' : 'var(--green)'};filter:drop-shadow(0 0 4px ${T.mode === 'work' ? 'var(--blue)' : 'var(--green)'})"/></svg>
      <div class="c"><div><div class="m">${esc(t(T.mode === 'work' ? 'focus_work' : 'focus_break'))}</div><div class="t" id="tLeft">${mmss(left)}</div></div></div></div></div>
    <div class="ctrl">
      <button class="btn solid" data-act="tgo">${esc(T.running ? t('pause') : (T.remain > 0 ? t('resume') : t('start')))}</button>
      <button class="btn ghost" data-act="treset">${esc(t('reset_t'))}</button>
      <button class="btn ghost" data-act="tskip">${esc(t('skip'))}</button></div></div>
    <div class="pn"><div class="ph"><span class="lbl">${esc(t('focus_today'))}</span><span class="num">${D.focus || 0} · ${(D.focus || 0) * S.settings.focus} ${esc(t('minutes'))}</span></div>
      <div class="pips">${pips}</div><div class="note">${esc(t('focus_hint'))}</div></div>`;
}
const mmss = ms => { const s = Math.ceil(ms / 1000); return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; };

function viewGoals() {
  return `<div class="pn"><div class="ph"><span class="lbl">${esc(t('main_goals'))}</span></div>${mainGoalRows(true)}</div>
    <div class="pn"><div class="ph"><span class="lbl">${esc(t('goal_add'))}</span></div>
    <form class="form" data-form="gnew" style="margin-top:0">
      <input class="in grow" name="title" id="gn-title" placeholder="${esc(t('goal_title'))}" required>
      <input class="in w80" name="target" id="gn-target" type="number" min="1" step="any" placeholder="${esc(t('goal_target'))}" required>
      <input class="in w80" name="unit" id="gn-unit" placeholder="${esc(t('goal_unit'))}">
      <input class="in" name="deadline" id="gn-dl" type="date" aria-label="${esc(t('goal_deadline'))}">
      <button class="btn" type="submit">${esc(t('add'))}</button></form></div>`;
}

function viewStatus() {
  const L = lvlInfo(S.xp);
  const statRows = STATS.map(s => { const v = statVal(s); const into = (S.statXP[s] || 0) % 50;
    return `<div class="statrow"><span>${esc(t('st_' + s + '_f'))}</span><b class="num">${v}</b><div class="bar"><i data-k="s-${s}" style="width:${into / 50 * 100}%"></i></div></div>`; }).join('');
  const wk = Array.from({ length: 7 }, (_, i) => addDays(todayKey(), i - 6)).map(k => {
    const D = S.days[k]; const n = D ? S.quests.filter(q => qDone(q, D)).length : 0; const p = S.quests.length ? n / S.quests.length : 0;
    return `<div class="col"><span class="num">${Math.round(p * 100)}</span><div class="b ${p >= 1 ? 'full' : ''}"><i style="height:${p * 100}%"></i></div><span>${esc(parseKey(k).toLocaleDateString(locale(), { weekday: 'short' }))}</span></div>`;
  }).join('');
  const qe = S.quests.map(q => `<div class="qe">
      <input class="in" id="qe-t-${q.id}" data-ch="qtitle" data-id="${q.id}" value="${esc(qTitle(q))}" aria-label="${esc(t('goal_title'))}">
      <select class="in" id="qe-s-${q.id}" data-ch="qstat" data-id="${q.id}" aria-label="stat">${STATS.map(s => `<option value="${s}" ${q.stat === s ? 'selected' : ''}>${esc(t('st_' + s))}</option>`).join('')}</select>
      <input class="in" id="qe-x-${q.id}" data-ch="qxp" data-id="${q.id}" type="number" min="0" max="200" value="${q.xp}" aria-label="XP">
      <button class="x" data-act="qdel" data-id="${q.id}" aria-label="${esc(t('del'))}">${ic('x')}</button>
      ${q.focus ? `<div class="sub"><input class="in w80" id="qe-n-${q.id}" data-ch="qtarget" data-id="${q.id}" type="number" min="1" max="20" value="${q.target}" aria-label="target"> ${esc(t('q_target'))} · ${esc(t('q_kind_focus'))}</div>` : `<div class="sub">${ic('clock').replace('<svg', '<svg width="13" height="13"')} ${esc(t('win_lbl'))}
        <input class="in" type="time" id="qe-f-${q.id}" data-ch="qfrom" data-id="${q.id}" value="${q.from || ''}" aria-label="from" style="padding:4px 6px">–
        <input class="in" type="time" id="qe-to-${q.id}" data-ch="qto" data-id="${q.id}" value="${q.to || ''}" aria-label="to" style="padding:4px 6px"></div>`}
    </div>`).join('');
  const np = ('Notification' in window) ? Notification.permission : 'na';
  return `<div class="pn"><div class="kv">
      <div><b>${L.lvl}</b><span>${esc(t('lvl'))} · ${esc(t('rank'))} ${rankOf(L.lvl)}</span></div>
      <div><b>${fmtNum(S.xp)}</b><span>${esc(t('total_xp'))}</span></div>
      <div><b>${S.best}</b><span>${esc(t('best'))}</span></div>
      <div><b>${S.perfect}</b><span>${esc(t('perfect_days'))}</span></div></div></div>
    <div class="pn"><div class="ph"><span class="lbl">${esc(t('stats'))}</span></div>${statRows}</div>
    <div class="pn"><div class="ph"><span class="lbl">${esc(t('week'))}</span><span class="small mu">%</span></div><div class="week">${wk}</div></div>
    ${window.syncSection ? window.syncSection() : ''}
    <div class="pn"><div class="ph"><span class="lbl">${esc(t('settings'))}</span></div>
      <div class="set"><label>${esc(t('lang'))}</label><div class="seg"><button class="${S.lang === 'ru' ? 'on' : ''}" data-act="setlang" data-id="ru">RU</button><button class="${S.lang === 'en' ? 'on' : ''}" data-act="setlang" data-id="en">EN</button></div></div>
      <div class="set"><label>${esc(t('theme'))}</label><div class="themes">${THEMES.map(th => `<button class="${S.theme === th.id ? 'on' : ''}" data-act="settheme" data-id="${th.id}" aria-pressed="${S.theme === th.id}">
        <span class="sw">${[0, 1, 3, 4, 5].map(i => `<i style="background:${th.c[i]}"></i>`).join('')}</span><span>${th.id}. ${esc(th[S.lang] || th.ru)}</span></button>`).join('')}</div></div>
      <div class="set"><label for="set-name">${esc(t('name'))}</label><input class="in" id="set-name" data-ch="name" value="${esc(S.name)}" maxlength="24"></div>
      <div class="set"><label>${esc(t('quests_edit'))}</label>${qe}<div class="note">${esc(t('win_note'))}</div><div><button class="btn ghost" data-act="qadd">+ ${esc(t('quest_add'))}</button></div></div>
      <div class="set"><label for="set-pen">${esc(t('penalty_text'))}</label><input class="in" id="set-pen" data-ch="penalty" value="${esc(S.settings.penalty || t('def_penalty'))}"></div>
      <div class="form" style="margin:0"><div class="set" style="margin:0"><label for="set-f">${esc(t('focus_len'))}</label><input class="in w80" id="set-f" type="number" min="5" max="120" data-ch="focuslen" value="${S.settings.focus}"></div>
        <div class="set" style="margin:0"><label for="set-b">${esc(t('break_len'))}</label><input class="in w80" id="set-b" type="number" min="1" max="60" data-ch="brklen" value="${S.settings.brk}"></div></div>
      <div class="set"><label>${esc(t('notif'))}</label><div>${np === 'granted' ? `<span class="ok">${esc(t('notif_ok'))}</span>` : `<button class="btn" data-act="notif">${esc(t('notif_on'))}</button>`}</div><div class="note">${esc(t('notif_note'))}</div></div>
      <div class="set"><label>${esc(t('backup'))}</label><div class="form" style="margin:0"><button class="btn ghost" data-act="export">${esc(t('export'))}</button>
        <label class="btn ghost" for="imp" style="display:inline-block">${esc(t('import'))}</label><input type="file" id="imp" accept="application/json" hidden data-ch="import"></div>
        <div class="note">${esc(t('saved_local'))}</div><div class="note">${esc(t('install'))}</div></div>
    </div>`;
}

function render() {
  // remember bar widths so a re-render slides them to the new value instead of jumping
  const prevW = {};
  if (!enterNext) document.querySelectorAll('[data-k]').forEach(b => { prevW[b.dataset.k] = b.style.width; });
  document.documentElement.lang = S.lang;
  applyTheme();
  renderInner();
  const moved = [];
  document.querySelectorAll('[data-k]').forEach(b => {
    const p = prevW[b.dataset.k];
    if (p != null && p !== b.style.width) { moved.push([b, b.style.width]); b.style.transition = 'none'; b.style.width = p; }
  });
  if (moved.length) { void document.body.offsetWidth; moved.forEach(([b, w]) => { b.style.transition = ''; b.style.width = w; }); }
}
function renderInner() {
  renderNav(); renderHeader();
  const v = { quests: viewQuests, diary: viewDiary, focus: viewFocus, goals: viewGoals, status: viewStatus }[tab]();
  const view = document.getElementById('view');
  view.innerHTML = v;
  view.classList.remove('enter');
  if (enterNext) {
    enterNext = false;
    view.querySelectorAll('.pn').forEach((p, i) => p.style.setProperty('--i', i));
    void view.offsetWidth; view.classList.add('enter');
  }
}
let enterNext = true;

/* ---------- Actions ---------- */
function armDelete(el, fn) {
  if (el.classList.contains('armed') || el.dataset.armed) { fn(); return; }
  el.classList.add('armed'); el.dataset.armed = '1'; el.title = t('confirm_del');
  const orig = el.innerHTML;
  if (el.classList.contains('btn')) el.textContent = t('confirm_del');
  else toast(t('confirm_del'));
  setTimeout(() => { el.classList.remove('armed'); delete el.dataset.armed; if (el.classList.contains('btn')) el.innerHTML = orig; }, 2500);
}

const ACT = {
  tab: el => { tab = el.dataset.id; if (tab === 'diary') diaryDay = todayKey(); editGoal = null; enterNext = true; render(); window.scrollTo(0, 0); },
  name: () => namePrompt(false),
  setlang: el => { S.lang = el.dataset.id; save(); render(); },
  settheme: el => { S.theme = Number(el.dataset.id); applyTheme(); save(); render(); },
  sysclose: () => nextSys(),
  quest: el => {
    const q = S.quests.find(x => x.id === el.dataset.id); if (!q) return;
    const D = day(todayKey());
    if (q.focus && (D.focus || 0) >= q.target) { tab = 'focus'; enterNext = true; render(); return; }
    const ws = winState(q);
    if (ws === 'lock') { toast(t('win_lock_t', q.from)); return; }
    if (ws === 'closed') { toast(t('win_closed_t', winLabel(q))); return; }
    const r = el.getBoundingClientRect();
    const on = !D.done[q.id]; D.done[q.id] = on; award(q.stat, on ? q.xp : -q.xp); save(); render();
    if (on) { floatXP(r, `+${q.xp} ${t('st_' + q.stat)}`); popCheck(`[data-act="quest"][data-id="${q.id}"]`); }
  },
  pen: () => { const D = day(todayKey()); if (D.penalty) { D.penalty.done = !D.penalty.done; save(); render(); } },
  dg: el => {
    const D = day(el.dataset.day); const g = D.goals.find(x => x.id === el.dataset.id); if (!g) return;
    const r = el.getBoundingClientRect();
    g.done = !g.done; award('dis', g.done ? 5 : -5); save(); render();
    if (g.done) { floatXP(r, `+5 ${t('st_dis')}`); popCheck(`[data-act="dg"][data-id="${g.id}"]`); }
  },
  dgdel: el => armDelete(el, () => { const D = day(el.dataset.day); const g = D.goals.find(x => x.id === el.dataset.id); if (g && g.done) award('dis', -5); D.goals = D.goals.filter(x => x.id !== el.dataset.id); save(); render(); }),
  dprev: () => { diaryDay = addDays(diaryDay, -1); render(); },
  dnext: () => { diaryDay = addDays(diaryDay, 1); render(); },
  dtoday: () => { diaryDay = todayKey(); render(); },
  gedit: el => { editGoal = el.dataset.id; render(); },
  gdel: el => armDelete(el, () => { S.goals = S.goals.filter(g => g.id !== el.dataset.id); editGoal = null; save(); render(); }),
  tgo: () => {
    const T = S.timer;
    if (T.running) { T.remain = Math.max(0, T.endAt - Date.now()); T.running = false; }
    else { T.endAt = Date.now() + timerLeft(); T.running = true; T.remain = 0; }
    save(); render();
  },
  treset: () => { S.timer = { mode: 'work', endAt: 0, remain: 0, running: false }; save(); render(); },
  tskip: () => { const T = S.timer; T.mode = T.mode === 'work' ? 'break' : 'work'; T.running = false; T.remain = 0; save(); render(); },
  qadd: () => { S.quests.push({ id: uid(), title: t('q_new'), stat: 'dis', xp: 15 }); save(); render(); },
  qdel: el => armDelete(el, () => { S.quests = S.quests.filter(q => q.id !== el.dataset.id); save(); render(); }),
  notif: async () => {
    if (!('Notification' in window)) { toast(t('notif_na')); return; }
    const p = await Notification.requestPermission();
    toast(p === 'granted' ? t('notif_ok') : t('notif_no')); render();
  },
  export: () => {
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `lockin-${todayKey()}.json`;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  },
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const fn = ACT[el.dataset.act]; if (fn) { e.preventDefault(); fn(el, e); }
});
document.getElementById('sys').addEventListener('click', e => { if (e.target.id === 'sys' && !e.currentTarget.querySelector('form')) nextSys(); });
document.addEventListener('keydown', e => { if (e.key === 'Enter' && sysOpen && !document.getElementById('sys').querySelector('form') && document.activeElement.tagName !== 'BUTTON') nextSys(); });

document.addEventListener('submit', e => {
  const f = e.target.closest('[data-form]'); if (!f) return;
  e.preventDefault();
  const fd = new FormData(f); const kind = f.dataset.form;
  if (kind === 'name') {
    const n = String(fd.get('name') || '').trim(); if (!n) return;
    const first = !S.named; S.name = n; S.named = true; save(); nextSys(); render();
    if (first) greeting();
    return;
  }
  if (kind === 'dg') {
    const text = String(fd.get('text') || '').trim(); if (!text) return;
    day(f.dataset.day).goals.push({ id: uid(), text, time: fd.get('time') || '', done: false, notified: false });
  } else if (kind === 'gadd') {
    const g = S.goals.find(x => x.id === f.dataset.id); const a = parseFloat(fd.get('amt'));
    if (g && !isNaN(a)) g.cur = Math.max(0, g.cur + a);
  } else if (kind === 'gedit') {
    const g = S.goals.find(x => x.id === f.dataset.id);
    if (g) { g.title = String(fd.get('title')).trim() || gTitle(g); delete g.key; g.target = parseFloat(fd.get('target')) || g.target; g.unit = String(fd.get('unit') || ''); delete g.unitKey; g.deadline = fd.get('deadline') || ''; }
    editGoal = null;
  } else if (kind === 'gnew') {
    S.goals.push({ id: uid(), title: String(fd.get('title')).trim(), cur: 0, target: parseFloat(fd.get('target')) || 1, unit: String(fd.get('unit') || ''), deadline: fd.get('deadline') || '', color: 'blue' });
  }
  save(); render();
  const again = document.getElementById(kind === 'dg' ? (tab === 'diary' ? 'dg-in' : 'qg-in') : '');
  if (again) again.focus();
});

document.addEventListener('change', e => {
  const el = e.target.closest('[data-ch]'); if (!el) return;
  const k = el.dataset.ch; const q = el.dataset.id ? S.quests.find(x => x.id === el.dataset.id) : null;
  if (k === 'note') { day(el.dataset.day).note = el.value; save(); return; }
  if (k === 'name') S.name = el.value.trim() || S.name;
  if (k === 'penalty') S.settings.penalty = el.value.trim();
  if (k === 'focuslen') S.settings.focus = Math.min(120, Math.max(5, parseInt(el.value, 10) || 25));
  if (k === 'brklen') S.settings.brk = Math.min(60, Math.max(1, parseInt(el.value, 10) || 5));
  if (q && k === 'qtitle') { q.title = el.value.trim() || qTitle(q); delete q.key; delete q.hint; }
  if (q && k === 'qstat') q.stat = el.value;
  if (q && k === 'qfrom') { if (el.value) q.from = el.value; else delete q.from; }
  if (q && k === 'qto') { if (el.value) q.to = el.value; else delete q.to; }
  if (q && k === 'qxp') q.xp = Math.min(200, Math.max(0, parseInt(el.value, 10) || 0));
  if (q && k === 'qtarget') { q.target = Math.min(20, Math.max(1, parseInt(el.value, 10) || 6)); }
  if (k === 'import') {
    const file = el.files && el.files[0]; if (!file) return;
    file.text().then(txt => { const d = JSON.parse(txt); if (!d || !d.quests || !d.days) throw new Error('bad'); S = Object.assign(defaults(), d); save(); render(); toast(t('imported')); })
      .catch(() => toast(t('bad_file')));
    return;
  }
  save(); render();
});
document.addEventListener('input', e => { const el = e.target.closest('[data-ch="note"]'); if (el) { day(el.dataset.day).note = el.value; save(); } });

/* ---------- Notifications & ticking ---------- */
async function notify(title, body) {
  toast(`${title}: ${body}`);
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const reg = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
    if (reg) reg.showNotification(title, { body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png' });
    else new Notification(title, { body, icon: 'icons/icon-192.png' });
  } catch (e) { /* ignore */ }
}

function finishTimer() {
  const T = S.timer;
  if (T.mode === 'work') {
    const D = day(todayKey()); D.focus = (D.focus || 0) + 1;
    award('int', 5); flash();
    const q = S.quests.find(x => x.focus);
    if (q && D.focus === q.target && !D.done[q.id]) award(q.stat, q.xp);
    T.mode = 'break'; notify(t('focus_work'), t('focus_done'));
  } else { T.mode = 'work'; notify(t('focus_break'), t('break_done')); }
  T.running = false; T.remain = 0; save(); render();
}

let lastKey = todayKey();
let lastWinSig = '';
function tick() {
  const tk = todayKey();
  if (tk !== lastKey) { lastKey = tk; rollover(false); diaryDay = tk; render(); }
  const r = document.getElementById('resetIn'); if (r) r.textContent = resetIn();
  // re-render when a quest window opens or closes (only touches the quests tab, never while typing)
  const sig = S.quests.map(winState).join();
  if (sig !== lastWinSig) {
    lastWinSig = sig;
    const typing = document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if (tab === 'quests' && !typing) render();
  }
  if (S.timer.running) {
    const left = S.timer.endAt - Date.now();
    if (left <= 0) finishTimer();
    else if (tab === 'focus') {
      const el = document.getElementById('tLeft'); if (el) el.textContent = mmss(left);
      const arc = document.getElementById('ringArc');
      if (arc) { const full = (S.timer.mode === 'work' ? S.settings.focus : S.settings.brk) * 60000; const C = 2 * Math.PI * 54; arc.setAttribute('stroke-dashoffset', C * (left / full)); }
    }
  }
  const now = new Date(); const hm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const D = day(tk); let ch = false;
  D.goals.forEach(g => { if (g.time && !g.done && !g.notified && g.time <= hm) { g.notified = true; ch = true; notify(t('remind'), `${g.time} · ${g.text}`); } });
  if (ch) save(true);
}

/* ---------- Boot ---------- */
const bootMsgs = rollover(true);
render();
if (!S.named) namePrompt(true);
else if (S.greetDay !== todayKey() || bootMsgs.length) greeting(bootMsgs);
setInterval(tick, 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
