using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Freelancer.Migrations
{
    public partial class UpdatePaymentTransactionNullables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Lệnh cũ: Thay đổi độ dài VnPayTransactionNo
            migrationBuilder.AlterColumn<string>(
                name: "VnPayTransactionNo",
                table: "PaymentTransactions",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            // 2. ✅ BỔ SUNG: Cho phép cột EmployerId nhận giá trị NULL
            migrationBuilder.AlterColumn<int>(
                name: "EmployerId",
                table: "PaymentTransactions",
                type: "int",
                nullable: true, // <-- Đã sửa
                oldClrType: typeof(int),
                oldType: "int");

            // 3. ✅ BỔ SUNG: Cho phép cột SeekerId nhận giá trị NULL
            migrationBuilder.AlterColumn<int>(
                name: "SeekerId",
                table: "PaymentTransactions",
                type: "int",
                nullable: true, // <-- Đã sửa
                oldClrType: typeof(int),
                oldType: "int");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Lệnh cũ: Đảo ngược VnPayTransactionNo
            migrationBuilder.AlterColumn<string>(
                name: "VnPayTransactionNo",
                table: "PaymentTransactions",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            // BỎ QUA việc đảo ngược EmployerId/SeekerId trong hàm Down nếu bạn chắc chắn không bao giờ rollback.
        }
    }
}