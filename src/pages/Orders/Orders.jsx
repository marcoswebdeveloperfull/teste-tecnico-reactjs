import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import OrderCard from '../../components/OrderCard/OrderCard';
import Modal from '../../components/Modal/Modal.jsx'; 
import Input from '../../components/Input/Input.jsx'; 
import './Orders.css';
import { getOrders, updateOrder } from '../../api/api'; 

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Estados para a funcionalidade de edição
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [editingOrder, setEditingOrder] = useState(null); 
  const [editedDescription, setEditedDescription] = useState(''); 
  const [editError, setEditError] = useState(null); 

  // Estados para filtro
  const [filterCnpj, setFilterCnpj] = useState('');
  const [filterName, setFilterName] = useState(''); // Corresponde à descrição do pedido
  const [filterCode, setFilterCode] = useState(''); // Corresponde ao ID do pedido

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Define quantos itens por página

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Calcula o valor total sempre que os pedidos selecionados mudam
    const newTotal = selectedOrders.reduce((sum, order) => sum + order.value, 0);
    setTotalValue(newTotal);
  }, [selectedOrders]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders(); // Usa a função getOrders
      // Mock de dados da API para o exemplo
      const mockOrders = [
        { id: '1', description: '100 Garrafas Galpin', value: 250.00, status: 'Pendente', cnpj: '12.345.678/0001-90', companyName: 'Galpin Bebidas'},
        { id: '2', description: '450 Lottas Galpin', value: 100.00, status: 'Pendente', cnpj: '12.345.678/0001-90', companyName: 'Galpin Bebidas'},
        { id: '3', description: '100 Garrafas - Galpin Kleiter', value: 220.00, status: 'Pendente', cnpj: '98.765.432/0001-10', companyName: 'Kleiter Distribuicao'},
        { id: '4', description: '60 Lottas Crystal Beer', value: 490.00, status: 'Pendente', cnpj: '11.222.333/0001-44', companyName: 'Crystal Brewery'},
        { id: '5', description: '50 Garrafas Black Princess', value: 120.00, status: 'Pendente', cnpj: '11.222.333/0001-44', companyName: 'Crystal Brewery'},
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Lógica de filtragem e paginação usando useMemo para otimização
  const paginatedOrders = useMemo(() => {
    let filtered = orders;

    // Aplica filtro por CNPJ (se houver, assumindo que orders têm propriedade cnpj)
    if (filterCnpj) {
      filtered = filtered.filter(order => 
        order.cnpj && order.cnpj.toLowerCase().includes(filterCnpj.toLowerCase())
      );
    }

    // Aplica filtro por Nome (descrição)
    if (filterName) {
      filtered = filtered.filter(order => 
        order.description.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    // Aplica filtro por Código (ID)
    if (filterCode) {
      filtered = filtered.filter(order => 
        String(order.id).toLowerCase().includes(filterCode.toLowerCase())
      );
    }

    // Paginação
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [orders, filterCnpj, filterName, filterCode, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    let filtered = orders;
    if (filterCnpj) {
      filtered = filtered.filter(order => 
        order.cnpj && order.cnpj.toLowerCase().includes(filterCnpj.toLowerCase())
      );
    }
    if (filterName) {
      filtered = filtered.filter(order => 
        order.description.toLowerCase().includes(filterName.toLowerCase())
      );
    }
    if (filterCode) {
      filtered = filtered.filter(order => 
        String(order.id).toLowerCase().includes(filterCode.toLowerCase())
      );
    }
    return Math.ceil(filtered.length / itemsPerPage);
  }, [orders, filterCnpj, filterName, filterCode, itemsPerPage]);

  const handleSelectOrder = (order) => {
    const isSelected = selectedOrders.some((item) => item.id === order.id);
    if (isSelected) {
      setSelectedOrders(selectedOrders.filter((item) => item.id !== order.id));
    } else {
      setSelectedOrders([...selectedOrders, order]);
    }
  };

  const handleEditClick = (order) => {
    setEditingOrder(order);
    setEditedDescription(order.description); 
    setIsModalOpen(true); 
    setEditError(null); 
  };

  const handleSaveEdit = async () => { 
    setEditError(null); 

    try {
      // Valida a descrição com Zod antes de enviar
      // orderDescriptionSchema.parse({ description: editedDescription }); // Removido para evitar erro de importação se Zod não estiver configurado

      if (editingOrder && editedDescription.trim() !== '') {
        await updateOrder(editingOrder.id, editedDescription); 

        setOrders(orders.map(order =>
          order.id === editingOrder.id ? { ...order, description: editedDescription } : order
        ));
        setIsModalOpen(false); 
        setEditingOrder(null); 
        setEditedDescription(''); 
        console.log(`Pedido ${editingOrder.id} atualizado para: ${editedDescription} no mock.`);
      }
    } catch (error) {
      console.error('Erro ao atualizar pedido no mock:', error);
      setEditError("Erro ao salvar a descrição. Tente novamente.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
    setEditedDescription('');
    setEditError(null); 
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePay = () => {
    navigate('/pagamento', { state: { totalValue } });
  };

  const isButtonDisabled = selectedOrders.length === 0;

  return (
    <div className="orders-container">
      <Header title="Pedidos Pendentes" />

      {/* Seção de Filtros */}
      <div className="filters-section">
        <Input 
          label="Filtrar por CNPJ"
          placeholder="CNPJ do cliente"
          value={filterCnpj}
          onChange={(e) => setFilterCnpj(e.target.value)}
        />
        <Input 
          label="Filtrar por Nome"
          placeholder="Nome do pedido"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <Input 
          label="Filtrar por Código"
          placeholder="Código do pedido"
          value={filterCode}
          onChange={(e) => setFilterCode(e.target.value)}
        />
      </div>

      <div className="order-list">
        {loading ? (
          <p className="loading">Carregando pedidos...</p>
        ) : (
          paginatedOrders.length > 0 ? ( // Usa paginatedOrders aqui
            paginatedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isSelected={selectedOrders.some((item) => item.id === order.id)}
                onSelect={handleSelectOrder}
                onEdit={handleEditClick} 
              />
            ))
          ) : (
            <p className="loading">Nenhum pedido encontrado com os filtros aplicados.</p>
          )
        )}
      </div>

      {/* Controles de Paginação */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <Button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            fullWidth={false}
          >
            Anterior
          </Button>
          <span>Página {currentPage} de {totalPages}</span>
          <Button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            fullWidth={false}
          >
            Próxima
          </Button>
        </div>
      )}

      <div className="orders-footer">
        <div className="footer-info">
          <span>Valor Total:</span>
          <span>R$ {totalValue.toFixed(2)}</span>
        </div>
        <Button onClick={handlePay} disabled={isButtonDisabled}>
          Pagar
        </Button>
      </div>

      {/* Modal de Edição */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h3>Editar Pedido</h3>
        {editError && <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{editError}</p>}
        <Input
          label="Descrição do Pedido"
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)} 
        />
        <Button onClick={handleSaveEdit} fullWidth={true}>Salvar</Button>
      </Modal>
    </div>
  );
};

export default Orders;
