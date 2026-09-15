/**
 * Utilitário de Temas Sazonais e de Eventos para o TuneIn.
 * Avalia a data local e ativa o tema exclusivo da época automaticamente.
 */

/**
 * Calcula o Domingo de Páscoa para qualquer ano (Algoritmo de Meeus/Jones/Butcher).
 * @param {number} year 
 * @returns {{ month: number, day: number }} mês (1-12) e dia (1-31)
 */
export function getEasterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = Março, 4 = Abril
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { month, day };
}

/**
 * Verifica se uma data está dentro do intervalo fechado [startMonth/startDay, endMonth/endDay].
 * Suporta intervalos no mesmo ano ou que cruzam o Ano Novo (ex.: 31 Dez - 02 Jan).
 */
function isDateInRange(month, day, startM, startD, endM, endD) {
  if (startM <= endM) {
    if (month < startM || month > endM) return false;
    if (month === startM && day < startD) return false;
    if (month === endM && day > endD) return false;
    return true;
  } else {
    // Cruza a viragem do ano (ex.: 31 Dez - 2 Jan)
    return (month === startM && day >= startD) || (month === endM && day <= endD);
  }
}

/**
 * Verifica se o utilizador desativou manualmente o tema sazonal.
 * @returns {boolean}
 */
export function isSeasonalThemeDisabled() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('tunein_seasonal_disabled') === 'true';
  }
  return false;
}

/**
 * Permite ao utilizador ativar ou desativar o tema sazonal.
 * @param {boolean} disabled
 */
export function setSeasonalThemeDisabled(disabled) {
  if (typeof window !== 'undefined') {
    if (disabled) {
      localStorage.setItem('tunein_seasonal_disabled', 'true');
    } else {
      localStorage.removeItem('tunein_seasonal_disabled');
    }
    const activeTheme = getActiveSeasonalTheme();
    applySeasonalTheme(activeTheme);
    window.dispatchEvent(new CustomEvent('seasonalThemeChange', { detail: activeTheme }));
  }
}

/**
 * Converte uma data para os componentes { year, month, day } no fuso horário de Los Angeles (America/Los_Angeles).
 * @param {Date} [date=new Date()]
 * @returns {{ year: number, month: number, day: number }}
 */
export function getLosAngelesDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const parts = formatter.formatToParts(date);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  for (const part of parts) {
    if (part.type === 'year') year = parseInt(part.value, 10);
    if (part.type === 'month') month = parseInt(part.value, 10);
    if (part.type === 'day') day = parseInt(part.value, 10);
  }
  return { year, month, day };
}

/**
 * Devolve o tema sazonal aplicável segundo o calendário ou override dev (ignora desativação manual).
 * Por predefinição, avalia a data no fuso horário oficial de Los Angeles (America/Los_Angeles).
 * @param {Date} [date]
 * @returns {'halloween'|'christmas'|'newyear'|'easter'|'spring'|'summer'|'autumn'|'winter'|'default'}
 */
export function getAvailableSeasonalTheme(date) {
  // Verificação de override exclusivo para testes em localhost/dev/rede local
  if (typeof window !== 'undefined') {
    const isDev = Boolean(
      import.meta.env?.DEV || 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.') ||
      window.location.hostname.startsWith('10.')
    );
    if (isDev) {
      const devOverride = localStorage.getItem('tunein_dev_seasonal_theme');
      if (devOverride) {
        return devOverride;
      }
    }
  }

  let year, month, day;
  if (!date) {
    // Avaliação oficial baseada no fuso horário de Los Angeles (Pacific Time)
    const laParts = getLosAngelesDateParts(new Date());
    year = laParts.year;
    month = laParts.month;
    day = laParts.day;
  } else {
    year = date.getFullYear();
    month = date.getMonth() + 1; // 1-12
    day = date.getDate(); // 1-31
  }

  // 1. Ano Novo: 31 de Dezembro a 02 de Janeiro (3 dias)
  if (isDateInRange(month, day, 12, 31, 1, 2)) {
    return 'newyear';
  }

  // 2. Natal: 24 a 26 de Dezembro (3 dias)
  if (isDateInRange(month, day, 12, 24, 12, 26)) {
    return 'christmas';
  }

  // 3. Inverno (Início da estação + 3 dias): 21 a 24 de Dezembro (4 dias)
  // Nota: dia 24 coincide com véspera de Natal, pelo que Natal tem precedência se após dia 24
  if (isDateInRange(month, day, 12, 21, 12, 23)) {
    return 'winter';
  }

  // 4. Halloween: 28 de Outubro a 02 de Novembro (6 dias)
  if (isDateInRange(month, day, 10, 28, 11, 2)) {
    return 'halloween';
  }

  // 5. Outono (Início da estação + 3 dias): 22 a 25 de Setembro (4 dias)
  if (isDateInRange(month, day, 9, 22, 9, 25)) {
    return 'autumn';
  }

  // 6. Verão (Início da estação + 3 dias): 21 a 24 de Junho (4 dias)
  if (isDateInRange(month, day, 6, 21, 6, 24)) {
    return 'summer';
  }

  // 7. Páscoa (Quinta-feira Santa a Domingo de Páscoa - 4 dias)
  const easter = getEasterSunday(year);
  const easterDate = new Date(year, easter.month - 1, easter.day);
  const holyThursday = new Date(easterDate);
  holyThursday.setDate(easterDate.getDate() - 3);

  const currentDate = new Date(year, month - 1, day);
  if (currentDate >= holyThursday && currentDate <= easterDate) {
    return 'easter';
  }

  // 8. Primavera (Início da estação + 3 dias): 20 a 23 de Março (4 dias)
  if (isDateInRange(month, day, 3, 20, 3, 23)) {
    return 'spring';
  }

  // Padrão no restante tempo
  return 'default';
}

/**
 * Devolve o tema sazonal atualmente em vigor.
 * Se o utilizador tiver desativado manualmente o tema sazonal, devolve 'default'.
 * @param {Date} [date=new Date()]
 * @returns {'halloween'|'christmas'|'newyear'|'easter'|'spring'|'summer'|'autumn'|'winter'|'default'}
 */
export function getActiveSeasonalTheme(date = new Date()) {
  if (isSeasonalThemeDisabled()) {
    return 'default';
  }
  return getAvailableSeasonalTheme(date);
}

/**
 * Aplica o atributo data-theme ao elemento raiz <html>
 * @param {string} theme 
 */
export function applySeasonalTheme(theme) {
  if (typeof document !== 'undefined' && document.documentElement) {
    if (theme && theme !== 'default') {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
}

/**
 * Inicializa a deteção do tema sazonal no arranque
 * @param {Date} [date]
 * @returns {string} Tema aplicado
 */
export function initSeasonalTheme(date) {
  const theme = getActiveSeasonalTheme(date);
  applySeasonalTheme(theme);
  return theme;
}
