import { test } from 'node:test';
import assert from 'node:assert';
import {
  generateCPF, isValidCPF, generateCNPJ, isValidCNPJ,
  generatePIS, isValidPIS, generatePerson, generatePhone, generateCEP,
  isValidCEP, isValidPhone,
} from '../src/generators.js';

test('generateCPF gera CPFs válidos', () => {
  for (let i = 0; i < 100; i++) assert.ok(isValidCPF(generateCPF()));
});

test('generateCNPJ gera CNPJs válidos', () => {
  for (let i = 0; i < 100; i++) assert.ok(isValidCNPJ(generateCNPJ()));
});

test('--raw retorna apenas dígitos', () => {
  assert.match(generateCPF(false), /^\d{11}$/);
  assert.match(generateCNPJ(false), /^\d{14}$/);
  assert.match(generatePIS(false), /^\d{11}$/);
});

test('formatação aplica máscara', () => {
  assert.match(generateCPF(), /^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
  assert.match(generatePhone(), /^\(\d{2}\) 9\d{4}-\d{4}$/);
  assert.match(generateCEP(), /^\d{5}-\d{3}$/);
});

test('generatePerson retorna campos esperados', () => {
  const p = generatePerson();
  assert.ok(p.nome && p.email.includes('@'));
  assert.ok(isValidCPF(p.cpf));
});

// --- Regressão #1: geradores nunca emitem documentos que o próprio validador rejeita ---

test('generateCPF sempre passa no isValidCPF (5000 iterações)', () => {
  for (let i = 0; i < 5000; i++) {
    const cpf = generateCPF(false);
    assert.ok(isValidCPF(cpf), `CPF inválido gerado: ${cpf}`);
  }
});

test('generateCNPJ sempre passa no isValidCNPJ (5000 iterações)', () => {
  for (let i = 0; i < 5000; i++) {
    const cnpj = generateCNPJ(false);
    assert.ok(isValidCNPJ(cnpj), `CNPJ inválido gerado: ${cnpj}`);
  }
});

test('generateCPF re-rola quando a base tem dígitos repetidos (ex.: 000000000)', () => {
  const orig = Math.random;
  let n = 0;
  // 1ª base = "000000000" (todos iguais → CPF 00000000000, rejeitado);
  // depois uma sequência variada, para a base seguinte ser aceita.
  Math.random = () => {
    const v = n < 9 ? 0 : ((n * 3) % 10) / 10;
    n++;
    return v;
  };
  try {
    const cpf = generateCPF(false);
    assert.ok(isValidCPF(cpf), `CPF inválido após re-roll: ${cpf}`);
    assert.ok(!/^(\d)\1+$/.test(cpf), `CPF não deveria ter todos os dígitos iguais: ${cpf}`);
  } finally {
    Math.random = orig;
  }
});

test('generateCNPJ produz valor válido mesmo com base degenerada (00000000)', () => {
  const orig = Math.random;
  Math.random = () => 0; // base aleatória "00000000" → CNPJ 00000000000191 (válido)
  try {
    const cnpj = generateCNPJ(false);
    assert.ok(isValidCNPJ(cnpj), `CNPJ inválido gerado: ${cnpj}`);
  } finally {
    Math.random = orig;
  }
});

// --- Validadores auxiliares novos ---

test('isValidPIS aceita PIS válido e rejeita inválido/repetido', () => {
  assert.ok(isValidPIS(generatePIS(false)));
  assert.ok(isValidPIS('12345678900'));
  assert.ok(!isValidPIS('12345678901')); // dígito verificador errado
  assert.ok(!isValidPIS('11111111111')); // todos iguais
  assert.ok(!isValidPIS('123'));          // tamanho errado
});

test('isValidCEP e isValidPhone checam formato', () => {
  assert.ok(isValidCEP(generateCEP()));
  assert.ok(isValidCEP('01001-000'));
  assert.ok(!isValidCEP('123'));
  assert.ok(isValidPhone(generatePhone()));   // celular 11 dígitos
  assert.ok(isValidPhone('1133334444'));      // fixo 10 dígitos
  assert.ok(!isValidPhone('123456'));
});
