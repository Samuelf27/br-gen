import { test } from 'node:test';
import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { generateCPF, generateCNPJ } from '../src/generators.js';

const CLI = fileURLToPath(new URL('../bin/cli.js', import.meta.url));

// Executa o CLI e devolve { code, out } (stdout+stderr juntos, code=0 em sucesso).
function runCli(...args) {
  try {
    const out = execFileSync(process.execPath, [CLI, ...args], { encoding: 'utf8' });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
}

// PIS válido conhecido (dígito verificador = 0); NÃO é um CPF válido.
const VALID_PIS = '12345678900';

test('validate detecta PIS de 11 dígitos (antes era reportado como CPF inválido)', () => {
  const { code, out } = runCli('validate', VALID_PIS);
  assert.strictEqual(code, 0);
  assert.match(out, /PIS/);
  assert.match(out, /✓/);
});

test('validate detecta CPF válido', () => {
  const cpf = generateCPF(false);
  const { code, out } = runCli('validate', cpf);
  assert.strictEqual(code, 0);
  assert.match(out, /CPF/);
  assert.match(out, /✓/);
});

test('validate detecta CNPJ de 14 dígitos', () => {
  const cnpj = generateCNPJ(false);
  const { code, out } = runCli('validate', cnpj);
  assert.strictEqual(code, 0);
  assert.match(out, /CNPJ/);
  assert.match(out, /✓/);
});

test('validate detecta CEP de 8 dígitos', () => {
  const { code, out } = runCli('validate', '01001-000');
  assert.strictEqual(code, 0);
  assert.match(out, /CEP/);
  assert.match(out, /✓/);
});

test('validate detecta telefone fixo de 10 dígitos', () => {
  const { code, out } = runCli('validate', '1133334444');
  assert.strictEqual(code, 0);
  assert.match(out, /Telefone/);
  assert.match(out, /✓/);
});

test('validate --type phone valida celular de 11 dígitos (ambíguo com CPF/PIS)', () => {
  const { code, out } = runCli('validate', '11987654321', '--type', 'phone');
  assert.strictEqual(code, 0);
  assert.match(out, /Telefone/);
  assert.match(out, /✓/);
});

test('validate --type pis força a validação como PIS', () => {
  const { code, out } = runCli('validate', VALID_PIS, '--type', 'pis');
  assert.strictEqual(code, 0);
  assert.match(out, /PIS/);
  assert.match(out, /✓/);
});

test('validate reporta inválido (saída 1) para 11 dígitos que não são CPF nem PIS', () => {
  const { code, out } = runCli('validate', '12345678901');
  assert.strictEqual(code, 1);
  assert.match(out, /CPF\/PIS/);
  assert.match(out, /✗/);
});

test('validate rejeita --type desconhecido', () => {
  const { code, out } = runCli('validate', '12345678900', '--type', 'foobar');
  assert.strictEqual(code, 1);
  assert.match(out, /desconhecido/i);
});
