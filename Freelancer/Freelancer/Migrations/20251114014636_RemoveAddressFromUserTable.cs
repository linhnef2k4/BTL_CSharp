using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Freelancer.Migrations
{
    public partial class RemoveAddressFromUserTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Users");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
