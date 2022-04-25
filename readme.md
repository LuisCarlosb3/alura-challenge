
## Transactions Manager
A aplicação deve permitir ao usuário realizar o upload de um arquivo csv contendo um histórico de transações, que devem ser salvas em um banco de dados

### Modelo:
 - Transação
	 - Banco de origem
	 - Agência de Origem
	 - Conta de Origem
	 - Banco destino
	 - Agência destino
	 - Conta destino
	 - Total
	 - Data da operação

### Requisitos:

 1.  A aplicação deve permitir ao usuário realizar o upload para enviar um arquivo .CSV com um histórico de transações
 2. O arquivo CSV não deve estar vazio
 3. A data das transações é definida a partir da primeira transação
 4. Se uma transação estiver com data diferente da estabelecida pelo critério 3, deve ser ignorada
 5. A importação de transações não deve ser realizada se já houver uma importação para o mesmo dia registrada
 6. Todas as informações da transação são obrigatórias, se houver um registro no arquivo sem uma informação, o mesmo deve ser ignorado