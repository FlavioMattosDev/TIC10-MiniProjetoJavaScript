const fs = require('fs');
const readline = require('readline');

function encontrarPessoaPorEmail(email, listaDePessoas) {
  return listaDePessoas.find((pessoa) => pessoa.email === email);
}

function removerPessoaPorEmail(email, listaDePessoas) {
  return listaDePessoas.filter((pessoa) => pessoa.email !== email);
}

function editarPessoaPorEmail(email, novosDados, listaDePessoas) {
  return listaDePessoas.map((pessoa) => {
    if (pessoa.email === email) {
      return { ...pessoa, ...novosDados };
    } else {
      return pessoa;
    }
  });
}

function carregarPessoasDoCSV(nomeDoArquivo) {
  try {
    const dados = fs.readFileSync(nomeDoArquivo, 'utf8');
    const linhas = dados.split('\n');
    const listaDePessoas = [];
    for (let linha of linhas) {
      const [nome, email, telefone] = linha.split(',');
      listaDePessoas.push({ nome, email, telefone });
    }
    return listaDePessoas;
  } catch (err) {
    console.error('Erro ao carregar dados do arquivo CSV:', err);
    return [];
  }
}

function salvarPessoasNoCSV(nomeDoArquivo, listaDePessoas) {
  try {
    const linhas = listaDePessoas
      .map((pessoa) => `${pessoa.nome},${pessoa.email},${pessoa.telefone}`)
      .join('\n');
    fs.writeFileSync(nomeDoArquivo, linhas);
    console.log('Dados salvos com sucesso no arquivo CSV.');
  } catch (err) {
    console.error('Erro ao salvar dados no arquivo CSV:', err);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pessoasCsv = 'pessoas.csv';
let listaDePessoas = carregarPessoasDoCSV(pessoasCsv);

function mostrarMenu() {
  console.log('Menu:');
  console.log('1 - Listar pessoas');
  console.log('2 - Adicionar pessoa');
  console.log('3 - Remover pessoa');
  console.log('4 - Editar pessoa');
  console.log('5 - Encontrar pessoa por email');
  console.log('6 - Sair');
}

function listarPessoas() {
  if (listaDePessoas.length === 0) {
    console.log('A lista de pessoas está vazia.');
  } else {
    console.log('Lista de pessoas:');
    listaDePessoas.forEach((pessoa) => {
      console.log(
        `Nome: ${pessoa.nome}, Email: ${pessoa.email}, Telefone: ${pessoa.telefone}`
      );
    });
  }
  mostrarMenu();
}

function adicionarPessoa() {
  rl.question('Digite o nome: ', (nome) => {
    rl.question('Digite o email: ', (email) => {
      rl.question('Digite o telefone: ', (telefone) => {
        listaDePessoas.push({ nome, email, telefone });
        salvarPessoasNoCSV(pessoasCsv, listaDePessoas);
        console.log('Pessoa adicionada com sucesso!');
        mostrarMenu();
      });
    });
  });
}

function removerPessoa() {
  rl.question('Digite o email da pessoa que deseja remover: ', (email) => {
    listaDePessoas = removerPessoaPorEmail(email, listaDePessoas);
    salvarPessoasNoCSV(pessoasCsv, listaDePessoas);
    console.log('Pessoa removida com sucesso!');
    mostrarMenu();
  });
}

function editarPessoa() {
  rl.question('Digite o email da pessoa que deseja editar: ', (email) => {
    const pessoa = encontrarPessoaPorEmail(email, listaDePessoas);
    if (pessoa) {
      rl.question('Digite o novo nome: ', (novoNome) => {
        rl.question('Digite o novo email: ', (novoEmail) => {
          rl.question('Digite o novo telefone: ', (novoTelefone) => {
            listaDePessoas = editarPessoaPorEmail(
              email,
              { nome: novoNome, email: novoEmail, telefone: novoTelefone },
              listaDePessoas
            );
            salvarPessoasNoCSV(pessoasCsv, listaDePessoas);
            console.log('Pessoa editada com sucesso!');
            mostrarMenu();
          });
        });
      });
    } else {
      console.log('Pessoa não encontrada!');
      mostrarMenu();
    }
  });
}

function encontrarPessoaPorEmail() {
  rl.question('Digite o email da pessoa que deseja encontrar: ', (email) => {
    const pessoa = encontrarPessoaPorEmail(email, listaDePessoas);
    if (pessoa) {
      console.log(
        `Nome: ${pessoa.nome}, Email: ${pessoa.email}, Telefone: ${pessoa.telefone}`
      );
    } else {
      console.log('Pessoa não encontrada!');
    }
    mostrarMenu();
  });
}

function iniciarPrograma() {
  mostrarMenu();
  rl.on('line', (linha) => {
    switch (linha.trim()) {
      case '1':
        listarPessoas();
        break;
      case '2':
        adicionarPessoa();
        break;
      case '3':
        removerPessoa();
        break;
      case '4':
        editarPessoa();
        break;
      case '5':
        encontrarPessoaPorEmail();
        break;
      case '6':
        console.log('Encerrando o programa...');
        rl.close();
        break;
      default:
        console.log('Opção inválida! Por favor, escolha uma opção válida.');
        mostrarMenu();
        break;
    }
  });
}

iniciarPrograma();
