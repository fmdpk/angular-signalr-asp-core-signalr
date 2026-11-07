using Microsoft.AspNetCore.SignalR;

namespace RealtimeDemo.Hubs
{
    public class PriceHub : Hub
    {
        public async Task SendPriceUpdate(string symbol, decimal price)
        {
            await Clients.All.SendAsync("ReceivePriceUpdate", symbol, price);
        }
    }
}
