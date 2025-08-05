const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const mockData = {
  orders: [
    { id: '1', description: '100 Garrafas Galpin', value: 250.00, status: 'Pendente' },
    { id: '2', description: '450 Lottas Galpin', value: 100.00, status: 'Pendente' },
    { id: '3', description: '371 Garrafas - Galpin Kleiter', value: 220.00, status: 'Pendente' },
    { id: '4', description: '690 Lottas Crystal Beer', value: 490.00, status: 'Pendente' },
    { id: '5', description: '540 Garrafas Black Princess', value: 120.00, status: 'Pendente' },
  ],
};

app.post('/v2/auth', (req, res) => {
  const { usuario, senha } = req.body;
  if (usuario === 'saurus' && senha === '123') { 
    return res.status(200).json({
      token: 'mock-token-12345-abcde',
      message: 'Login bem-sucedido!',
    });
  }
  return res.status(401).json({ message: 'Credenciais inválidas' });
});

app.get('/financeiro/faturas', (req, res) => {
  res.status(200).json(mockData.orders);
});

app.put('/financeiro/faturas/:id', (req, res) => {
  const orderId = req.params.id;
  const { description } = req.body;

  const orderIndex = mockData.orders.findIndex(order => order.id === orderId);

  if (orderIndex !== -1) {
    mockData.orders[orderIndex].description = description;
    console.log(`Pedido ${orderId} atualizado no mock para: ${description}`);
    return res.status(200).json({ 
      message: 'Pedido atualizado com sucesso no mock!', 
      updatedOrder: mockData.orders[orderIndex] 
    });
  } else {
    return res.status(404).json({ message: 'Pedido não encontrado no mock.' });
  }
});

app.post('/financeiro/retorno', (req, res) => {
  console.log('Recebido retorno de pagamento:', req.body);
  res.status(200).json({
    transactionId: `trans_${Date.now()}`,
    status: 'success',
    message: 'Pagamento processado com sucesso.',
  });
});

app.listen(port, () => {
  console.log(`Mock API rodando em http://localhost:${port}`);
  console.log('Endpoints disponíveis:');
  console.log(`- POST /v2/auth (usuario: 'saurus', senha: '123')`);
  console.log(`- GET /financeiro/faturas`);
  console.log(`- PUT /financeiro/faturas/:id (para atualizar descrição do pedido)`);
  console.log(`- POST /financeiro/retorno`);
});
