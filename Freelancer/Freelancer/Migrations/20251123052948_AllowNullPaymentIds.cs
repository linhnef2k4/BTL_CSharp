using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Freelancer.Migrations
{
    public partial class AllowNullPaymentIds : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PaymentTransactions_Seekers_SeekerId",
                table: "PaymentTransactions");

            migrationBuilder.AlterColumn<int>(
                name: "SeekerId",
                table: "PaymentTransactions",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "EmployerId",
                table: "PaymentTransactions",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentTransactions_Seekers_SeekerId",
                table: "PaymentTransactions",
                column: "SeekerId",
                principalTable: "Seekers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PaymentTransactions_Seekers_SeekerId",
                table: "PaymentTransactions");

            migrationBuilder.AlterColumn<int>(
                name: "SeekerId",
                table: "PaymentTransactions",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "EmployerId",
                table: "PaymentTransactions",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentTransactions_Seekers_SeekerId",
                table: "PaymentTransactions",
                column: "SeekerId",
                principalTable: "Seekers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
