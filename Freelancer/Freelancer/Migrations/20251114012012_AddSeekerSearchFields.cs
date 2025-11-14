using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Freelancer.Migrations
{
    public partial class AddSeekerSearchFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Level",
                table: "Seekers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Seekers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Skills",
                table: "Seekers",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Level",
                table: "Seekers");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "Seekers");

            migrationBuilder.DropColumn(
                name: "Skills",
                table: "Seekers");
        }
    }
}
