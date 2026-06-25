import { test } from 'node:test';
import assert from 'node:assert';
import {
  generateCPF, isValidCPF, generateCNPJ, isValidCNPJ,
  generatePIS, generatePerson, generatePhone, generateCEP,
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
