using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FavoriteMovieAppBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class notificaitonupdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SentAt",
                table: "Notification");

            migrationBuilder.RenameColumn(
                name: "IsSent",
                table: "Notification",
                newName: "IsSeen");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsSeen",
                table: "Notification",
                newName: "IsSent");

            migrationBuilder.AddColumn<DateTime>(
                name: "SentAt",
                table: "Notification",
                type: "datetime2",
                nullable: true);
        }
    }
}
