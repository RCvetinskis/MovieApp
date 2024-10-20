using System.Text.Json;

namespace FavoriteMovieAppBackEnd.Utilities
{
    public class JSerializeOptions
    {

        public static readonly JsonSerializerOptions DefaultOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
        };
    }
}
