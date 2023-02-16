using API.Entities.Order;
using API.Interfaces;

namespace API.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _uow;
        private readonly IBasketRepository _basketRepository;
        public OrderService(IBasketRepository basketRepository, IUnitOfWork uow)
        {
            _basketRepository = basketRepository;
            _uow = uow;
        }

        public async Task<Order> CreateOrderAsync(string userName, int delieveryMethodId, string basketId, Address shippingAddress)
        {

            var basket = await _basketRepository.GetBasketAsync(basketId);

    
            var items = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var productItem = await _uow.ProductRepository.GetProductByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
                items.Add(orderItem);
            }


            var deliveryMethod = await _uow.DeliveryMethodRepository.GetDeliveryMethodByIdAsync(delieveryMethodId);

    
            var subtotal = items.Sum(item => item.Price * item.Quantity);

            var order = await _uow.OrderRepository.GetOrderByPaymentIntentIdAsync(basket.PaymentIntentId);

            if(order != null) 
            {
                order.ShipToAddress = shippingAddress;
                order.DeliveryMethod = deliveryMethod;
                order.Subtotal = subtotal;
                _uow.OrderRepository.UpdateOrder(order);
            }
            else 
            {
                order = new Order(items, userName, shippingAddress, deliveryMethod, subtotal, basket.PaymentIntentId);
                _uow.OrderRepository.AddOrder(order);
            }

            var result = await _uow.Complete();

            if (result <= 0) return null;
         
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _uow.DeliveryMethodRepository.GetDeliveryMethodsAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string userName)
        {
            return await _uow.OrderRepository.GetOrderByIdAsync(id, userName);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string userName)
        {
            return await _uow.OrderRepository.GetOrdersForUserAsync(userName);
        }
    }
}