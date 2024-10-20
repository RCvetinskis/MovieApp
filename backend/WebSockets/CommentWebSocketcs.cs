using FavoriteMovieAppBackEnd.Models.DTOS;
using FavoriteMovieAppBackEnd.Utilities;
using Fleck;
using System.Collections.Concurrent;
using System.Text.Json;

namespace FavoriteMovieAppBackEnd.WebSockets
{
    public class CommentWebSocket
    {
        private readonly WebSocketServer _server;
        private readonly ConcurrentDictionary<string, List<IWebSocketConnection>> _postConnections;

        public CommentWebSocket()
        {
            _server = new WebSocketServer("ws://0.0.0.0:7163/comment/post");
            _postConnections = new ConcurrentDictionary<string, List<IWebSocketConnection>>();

            _server.Start(ws =>
            {
                ws.OnOpen = () =>
                {
                    var pathSegments = ws.ConnectionInfo.Path.Split('/');

                    if (pathSegments.Length == 4 && pathSegments[1] == "comment" && pathSegments[2] == "post")
                    {
                        var postId = pathSegments[3]; // Get the postId (4th segment)
                        _postConnections.AddOrUpdate(postId, new List<IWebSocketConnection> { ws },
                            (key, oldValue) =>
                            {
                                oldValue.Add(ws);
                                return oldValue;
                            });

                    }
                    else
                    {
                        Console.WriteLine("Invalid path structure: " + ws.ConnectionInfo.Path);
                    }
                };

                ws.OnClose = () =>
                {
                    // Remove the connection from the postId list
                    foreach (var postId in _postConnections.Keys)
                    {
                        _postConnections[postId].Remove(ws);
                        if (_postConnections[postId].Count == 0)
                        {
                            _postConnections.TryRemove(postId, out _);
                        }
                    }
                };
                ws.OnMessage = message =>
                {

                    var requestMessage = JsonSerializer.Deserialize<CommentDto>(message, JSerializeOptions.DefaultOptions);

                    if (requestMessage != null)

                    {
                        BroadcastToAllClients(requestMessage);
                    }


                };
            });
        }

        public void BroadcastToAllClients(CommentDto commentDto)
        {
            string jsonMessage = JsonSerializer.Serialize(commentDto, JSerializeOptions.DefaultOptions);

            var postId = commentDto.PostId;
            if (_postConnections.TryGetValue(postId, out var connections))
            {
                Console.WriteLine($"Broadcasting to {connections.Count} clients for postId: {postId}");

                foreach (var connection in connections)
                {
                    try
                    {
                        connection.Send(jsonMessage);

                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Failed to send message to a client: {ex.Message}");
                    }
                }
            }
            else
            {
                Console.WriteLine($"No connections found for postId: {postId}");
            }
        }

    }
}
