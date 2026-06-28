using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeerFerment.Api.Migrations
{
    /// <inheritdoc />
    public partial class CreateFermentationRecords : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "fermentation_records",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    registered_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    beer_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tank_id = table.Column<Guid>(type: "uuid", nullable: false),
                    batch_number = table.Column<string>(type: "text", nullable: false),
                    temperature = table.Column<decimal>(type: "numeric", nullable: false),
                    ph = table.Column<decimal>(type: "numeric", nullable: false),
                    extract = table.Column<decimal>(type: "numeric", nullable: false),
                    notes = table.Column<string>(type: "text", nullable: true),
                    classification = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_fermentation_records", x => x.id);
                    table.ForeignKey(
                        name: "fk_fermentation_records_beers_beer_id",
                        column: x => x.beer_id,
                        principalTable: "beers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_fermentation_records_tanks_tank_id",
                        column: x => x.tank_id,
                        principalTable: "tanks",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_fermentation_records_batch_number",
                table: "fermentation_records",
                column: "batch_number");

            migrationBuilder.CreateIndex(
                name: "ix_fermentation_records_beer_id",
                table: "fermentation_records",
                column: "beer_id");

            migrationBuilder.CreateIndex(
                name: "ix_fermentation_records_tank_id",
                table: "fermentation_records",
                column: "tank_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "fermentation_records");
        }
    }
}
