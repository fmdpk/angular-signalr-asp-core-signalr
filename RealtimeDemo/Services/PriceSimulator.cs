using Microsoft.AspNetCore.SignalR;
using RealtimeDemo.Hubs;
using RealtimeDemo.Models;
using System.Timers;

namespace RealtimeDemo.Services
{
    public class PriceSimulator : IHostedService
    {
        private readonly IHubContext<PriceHub> _hubContext;
        private System.Timers.Timer _timer = new(2000);
        private readonly Random _random = new();

        public PriceSimulator(IHubContext<PriceHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer.Elapsed += async (sender, args) =>
            {
                var price = Math.Round(
                    (decimal)(_random.NextDouble() * 100), 2);

                var priceUpdate = new PriceUpdate
                {
                    Symbol = "EUR/USD",
                    Price = price
                };

                await _hubContext.Clients.All.SendAsync(
                    "ReceivePriceUpdate",
                    priceUpdate
                );
            };

            _timer.Start();

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer.Stop();
            return Task.CompletedTask;
        }
    }
}