// Geradores e validadores de documentos brasileiros (sem dependências).

const rngDigits = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');
const onlyDigits = (s) => String(s).replace(/\D/g, '');

// ---------- CPF ----------
function cpfCheck(base, factor) {
  let total = 0;
  for (const d of base) total += Number(d) * factor--;
  const rest = (total * 10) % 11;
  return rest === 10 ? 0 : rest;
}
export function generateCPF(formatted = true) {
  const base = rngDigits(9);
  const d1 = cpfCheck(base, 10);
  const d2 = cpfCheck(base + d1, 11);
  const cpf = base + d1 + d2;
  return formatted ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : cpf;
}
export function isValidCPF(value) {
  const d = onlyDigits(value);
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  return cpfCheck(d.slice(0, 9), 10) === +d[9] && cpfCheck(d.slice(0, 10), 11) === +d[10];
}

// ---------- CNPJ ----------
const F = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const S = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
function cnpjCheck(base, w) {
  let total = 0;
  for (let i = 0; i < w.length; i++) total += Number(base[i]) * w[i];
  const rest = total % 11;
  return rest < 2 ? 0 : 11 - rest;
}
export function generateCNPJ(formatted = true) {
  const base = rngDigits(8) + '0001';
  const d1 = cnpjCheck(base, F);
  const d2 = cnpjCheck(base + d1, S);
  const cnpj = base + d1 + d2;
  return formatted ? cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5') : cnpj;
}
export function isValidCNPJ(value) {
  const d = onlyDigits(value);
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  return cnpjCheck(d.slice(0, 12), F) === +d[12] && cnpjCheck(d.slice(0, 13), S) === +d[13];
}

// ---------- PIS ----------
const PW = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
function pisCheck(base) {
  let total = 0;
  for (let i = 0; i < 10; i++) total += Number(base[i]) * PW[i];
  const rest = 11 - (total % 11);
  return rest >= 10 ? 0 : rest;
}
export function generatePIS(formatted = true) {
  const base = rngDigits(10);
  const pis = base + pisCheck(base);
  return formatted ? pis.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, '$1.$2.$3-$4') : pis;
}

// ---------- CEP / Telefone ----------
const DDDs = [11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 31, 41, 47, 51, 61, 71, 81, 85, 91];
export function generateCEP(formatted = true) {
  const cep = rngDigits(8);
  return formatted ? cep.replace(/(\d{5})(\d{3})/, '$1-$2') : cep;
}
export function generatePhone(formatted = true) {
  const ddd = DDDs[Math.floor(Math.random() * DDDs.length)];
  const num = '9' + rngDigits(8);
  const full = `${ddd}${num}`;
  return formatted ? full.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') : full;
}

// ---------- Pessoa fake ----------
const FIRST = ['Ana', 'Bruno', 'Carla', 'Diego', 'Eduarda', 'Felipe', 'Gabriela', 'Henrique', 'Isabela', 'João', 'Larissa', 'Marcos', 'Natália', 'Otávio', 'Paula', 'Rafael', 'Sofia', 'Thiago', 'Vitória', 'Wesley'];
const LAST = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Pereira', 'Costa', 'Almeida', 'Ferreira', 'Rodrigues', 'Gomes', 'Martins', 'Araújo', 'Barbosa', 'Ribeiro'];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function generatePerson() {
  const first = pick(FIRST);
  const last = pick(LAST);
  const nome = `${first} ${last}`;
  return {
    nome,
    cpf: generateCPF(),
    email: `${slug(first)}.${slug(last)}${Math.floor(Math.random() * 99)}@example.com`,
    telefone: generatePhone(),
    cep: generateCEP(),
  };
}
