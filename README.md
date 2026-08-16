<h1 align="center">⌨️ br-gen</h1>

<p align="center">
CLI para gerar <b>dados brasileiros válidos</b> (CPF, CNPJ, PIS, telefone, pessoa fake) direto no terminal — perfeito para testes e seeds.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/CLI-000000?style=flat&logo=gnubash&logoColor=white"/>
  <a href="https://github.com/Samuelf27/br-gen/actions/workflows/ci.yml"><img src="https://github.com/Samuelf27/br-gen/actions/workflows/ci.yml/badge.svg" alt="CI"/></a>
  <img src="https://img.shields.io/badge/dependencies-0-blue?style=flat"/>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat"/>
</p>

---

## 📌 Sobre

Quem trabalha com sistemas brasileiros vive precisando de **CPF, CNPJ e PIS válidos** para testar formulários, popular bancos de dados ou rodar testes automatizados. O `br-gen` gera tudo isso (com dígitos verificadores corretos) em um comando — sem dependências.

## 🚀 Uso rápido

> **Ainda não publicado no npm.** Por enquanto, rode a partir do repositório:

```bash
git clone https://github.com/Samuelf27/br-gen.git
cd br-gen

node bin/br-gen.js cpf
node bin/br-gen.js person
```

Ou instale direto do GitHub, com o comando `br-gen` disponível no PATH:

```bash
npm install -g github:Samuelf27/br-gen
br-gen person
```

## 🧰 Comandos

```bash
br-gen cpf            # gera um CPF válido
br-gen cnpj -n 5      # gera 5 CNPJs válidos
br-gen pis            # gera um PIS/PASEP válido
br-gen phone          # gera um celular com DDD válido
br-gen cep            # gera um CEP
br-gen person         # gera uma pessoa fake completa
br-gen person --json  # ...em JSON
br-gen validate 529.982.247-25         # detecta o tipo e valida
br-gen validate 123.45678.90-0 --type pis   # força o tipo
```

### `validate` — detecção de tipo

O comando `validate` detecta o tipo pelo número de dígitos:

| Dígitos | Tipo detectado |
|---|---|
| 14 | CNPJ |
| 11 | CPF **ou** PIS (testa os dois e informa qual casa) |
| 10 | Telefone |
| 8 | CEP |

Como CPF, PIS e telefone celular têm 11 dígitos, casos ambíguos podem ser
resolvidos com `--type`. Por exemplo, um celular de 11 dígitos é validado com
`br-gen validate 11987654321 --type phone`. Tipos aceitos: `cpf`, `cnpj`,
`pis`, `cep`, `phone`.

### Opções
| Flag | Descrição |
|---|---|
| `-n, --count <N>` | Quantidade a gerar (1–1000) |
| `--type <tipo>` | Força o tipo no `validate` (`cpf`, `cnpj`, `pis`, `cep`, `phone`) |
| `--raw` | Sem máscara (só dígitos) |
| `--json` | Saída em JSON |
| `-h, --help` | Ajuda |
| `-v, --version` | Versão |

## 💻 Exemplo de saída

```text
$ br-gen person
Natália Costa
  CPF:      098.829.201-79
  E-mail:   natalia.costa66@example.com
  Telefone: (15) 98966-9687
  CEP:      80157-689
```

> ⚠️ Os dados são **fictícios** (apenas matematicamente válidos) e não correspondem a pessoas reais. Use só para testes.

## 🛠️ Desenvolvimento

```bash
npm test   # testes com o runner nativo do Node
```

## 🧪 Testes

**20 testes** com o runner nativo do Node (`node --test`), sem dependência externa.

Os geradores são verificados por **teste de propriedade**: em vez de conferir alguns casos, a suíte gera **5.000 CPFs e 5.000 CNPJs** e exige que todos passem no validador correspondente. Também cobre as bases degeneradas — `000000000` e `00000000` — em que o gerador precisa re-rolar em vez de emitir um documento de dígitos repetidos.

| Arquivo | Cobre |
|---|---|
| `test/generators.test.js` | Propriedade dos geradores (5.000 iterações cada), `--raw`, máscara e `generatePerson` |
| `test/cli.test.js` | Detecção de tipo por tamanho, desambiguação entre CPF/PIS/celular (todos com 11 dígitos), `--type` forçado e códigos de saída |

```bash
npm test
```

## 📄 Licença

[MIT](LICENSE) © Samuel Ferreira

---

<p align="center">
  <a href="https://github.com/Samuelf27">GitHub</a> · <a href="https://www.linkedin.com/in/samuel-ferreira27/">LinkedIn</a>
</p>
