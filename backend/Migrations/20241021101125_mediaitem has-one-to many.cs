using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FavoriteMovieAppBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class mediaitemhasonetomany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Favorites_MediaItemId",
                table: "Favorites");

            migrationBuilder.DropColumn(
                name: "FavoriteId",
                table: "MediaItem");

            migrationBuilder.CreateIndex(
                name: "IX_Favorites_MediaItemId",
                table: "Favorites",
                column: "MediaItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Favorites_MediaItemId",
                table: "Favorites");

            migrationBuilder.AddColumn<Guid>(
                name: "FavoriteId",
                table: "MediaItem",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Favorites_MediaItemId",
                table: "Favorites",
                column: "MediaItemId",
                unique: true);
        }
    }
}
