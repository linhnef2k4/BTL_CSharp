using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Freelancer.Migrations
{
    public partial class AddCompanyLogoUrlToEmployer : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CompanyLogoUrl",
                table: "Employers",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompanyLogoUrl",
                table: "Employers");
        }
    }
}
