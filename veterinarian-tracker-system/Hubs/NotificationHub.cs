using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace veterinarian_tracker_system.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task SendNotificationToOwner(int ownerId, string message, string type)
        {
            await Clients.Group($"Owner_{ownerId}").SendAsync("ReceiveNotification", message, type);
        }

        public async Task SendNotificationToVeterinarian(int vetId, string message, string type)
        {
            await Clients.Group($"Vet_{vetId}").SendAsync("ReceiveNotification", message, type);
        }

        public async Task JoinOwnerGroup(int ownerId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Owner_{ownerId}");
        }

        public async Task JoinVeterinarianGroup(int vetId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Vet_{vetId}");
        }

        public async Task SendAppointmentConfirmation(int ownerId, string message)
        {
            await Clients.Group($"Owner_{ownerId}").SendAsync("ReceiveAppointmentConfirmation", message);
        }

        public async Task SendPrescriptionNotification(int ownerId, string message)
        {
            await Clients.Group($"Owner_{ownerId}").SendAsync("ReceivePrescriptionNotification", message);
        }

        public async Task SendChatMessage(int senderId, int receiverId, string message, string senderType)
        {
            if (senderType == "Owner")
            {
                await Clients.Group($"Vet_{receiverId}").SendAsync("ReceiveChatMessage", senderId, message, senderType);
            }
            else if (senderType == "Veterinarian")
            {
                await Clients.Group($"Owner_{receiverId}").SendAsync("ReceiveChatMessage", senderId, message, senderType);
            }
        }

        public async Task UpdateVeterinarianStatus(int vetId, bool isAvailable)
        {
            await Clients.All.SendAsync("VeterinarianStatusChanged", vetId, isAvailable);
        }
    }
}