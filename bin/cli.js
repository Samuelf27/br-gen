#!/usr/bin/env node
import {
  generateCPF, generateCNPJ, generatePIS, generateCEP, generatePhone, generatePerson,
  isValidCPF, isValidCNPJ,
} from '../src/generators.js';

const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  green: '\x1b[32m', red: '\x1b[31m', cyan: '\x1b[36m', yellow: '\x1b[33m', mag: '\x1b[35m',
};
const c = (color, s) => `${C[color]}${s}${C.reset}`;

const VERSION = '1.0.0';

const HELP = `
${c('mag', c('bold', 'br-gen'))} ${c('dim', 'v' + VERSION)} — gera dados brasileiros válidos para testes 🇧🇷

${c('bold', 'USO')}
  br-gen <comando> [opções]

${c('bold', 'COMANDOS')}
  cpf            Gera CPF(s) válido(s)
  cnpj           Gera CNPJ(s) válido(s)
  pis            Gera PIS/PASEP válido(s)
  cep            Gera CEP(s)
  phone          Gera telefone(s) celular
  person         Gera uma pessoa fake completa
  validate <doc> Valida um CPF ou CNPJ (detecta pelo tamanho)

${c('bold', 'OPÇÕES')}
  -n, --count <N>   Quantidade a gerar (padrão: 1)
  --raw             Sem máscara (só dígitos)
  --json            Saída em JSON
  -h, --help        Mostra esta ajuda
  -v, --version     Mostra a versão

${c('bold', 'EXEMPLOS')}
  ${c('dim', '$')} br-gen cpf -n 3
  ${c('dim', '$')} br-gen person --json
  ${c('dim', '$')} br-gen validate 529.982.247-25
`;

function parseArgs(argv) {
  const args = { _: [], count: 1, raw: false, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-n' || a === '--count') args.count = Math.max(1, Math.min(1000, +argv[++i] || 1));
    else if (a === '--raw') args.raw = true;
    else if (a === '--json') args.json = true;
    else if (a === '-h' || a === '--help') args.help = true;
    else if (a === '-v' || a === '--version') args.version = true;
    else args._.push(a);
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.version) return console.log('br-gen v' + VERSION);
  if (args.help || args._.length === 0) return console.log(HELP);

  const cmd = args._[0];
  const fmt = !args.raw;
  const gens = {
    cpf: () => generateCPF(fmt),
    cnpj: () => generateCNPJ(fmt),
    pis: () => generatePIS(fmt),
    cep: () => generateCEP(fmt),
    phone: () => generatePhone(fmt),
  };

  if (cmd === 'validate') {
    const doc = args._[1];
    if (!doc) { console.error(c('red', 'Informe um documento: br-gen validate <doc>')); process.exit(1); }
    const digits = doc.replace(/\D/g, '');
    const valid = digits.length === 14 ? isValidCNPJ(doc) : isValidCPF(doc);
    const tipo = digits.length === 14 ? 'CNPJ' : 'CPF';
    console.log(`${tipo} ${c('bold', doc)} → ${valid ? c('green', '✓ válido') : c('red', '✗ inválido')}`);
    process.exit(valid ? 0 : 1);
  }

  if (cmd === 'person') {
    const people = Array.from({ length: args.count }, generatePerson);
    if (args.json) return console.log(JSON.stringify(args.count === 1 ? people[0] : people, null, 2));
    for (const p of people) {
      console.log(`${c('cyan', c('bold', p.nome))}
  CPF:      ${p.cpf}
  E-mail:   ${p.email}
  Telefone: ${p.telefone}
  CEP:      ${p.cep}
`);
    }
    return;
  }

  if (!gens[cmd]) { console.error(c('red', `Comando desconhecido: ${cmd}`)); console.log(HELP); process.exit(1); }

  const values = Array.from({ length: args.count }, gens[cmd]);
  if (args.json) return console.log(JSON.stringify(args.count === 1 ? values[0] : values));
  values.forEach((v) => console.log(c('green', v)));
}

main();
