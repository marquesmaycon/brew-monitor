using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BrewMonitor.Api.Migrations
{
    /// <inheritdoc />
    public partial class CreateFermentationParameters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "fermentation_parameters",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    beer_id = table.Column<Guid>(type: "uuid", nullable: false),
                    min_temperature = table.Column<decimal>(type: "numeric", nullable: false),
                    max_temperature = table.Column<decimal>(type: "numeric", nullable: false),
                    min_ph = table.Column<decimal>(type: "numeric", nullable: false),
                    max_ph = table.Column<decimal>(type: "numeric", nullable: false),
                    min_extract = table.Column<decimal>(type: "numeric", nullable: false),
                    max_extract = table.Column<decimal>(type: "numeric", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_fermentation_parameters", x => x.id);
                    table.ForeignKey(
                        name: "fk_fermentation_parameters_beers_beer_id",
                        column: x => x.beer_id,
                        principalTable: "beers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_fermentation_parameters_beer_id",
                table: "fermentation_parameters",
                column: "beer_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "fermentation_parameters");
        }
    }
}
