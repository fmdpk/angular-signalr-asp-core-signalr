namespace RealtimeDemo.Models
{
    public class PriceUpdate
    {
        public string Symbol { get; set; } = string.Empty;

        public decimal Price { get; set; }
    }
}