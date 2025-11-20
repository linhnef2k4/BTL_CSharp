using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Freelancer.Migrations
{
    public partial class UpdatePaymentTransactionForSeeker : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SeekerId",
                table: "PaymentTransactions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_PaymentTransactions_SeekerId",
                table: "PaymentTransactions",
                column: "SeekerId");

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentTransactions_Seekers_SeekerId",
                table: "PaymentTransactions",
                column: "SeekerId",
                principalTable: "Seekers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PaymentTransactions_Seekers_SeekerId",
                table: "PaymentTransactions");

            migrationBuilder.DropIndex(
                name: "IX_PaymentTransactions_SeekerId",
                table: "PaymentTransactions");

            migrationBuilder.DropColumn(
                name: "SeekerId",
                table: "PaymentTransactions");
        }
    }
}
