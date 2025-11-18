using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Freelancer.Migrations
{
    public partial class AddNestedComments_ForcedNull : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ParentCommentId",
                table: "SocialPostComments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SocialPostComments_ParentCommentId",
                table: "SocialPostComments",
                column: "ParentCommentId");

            migrationBuilder.AddForeignKey(
                name: "FK_SocialPostComments_SocialPostComments_ParentCommentId",
                table: "SocialPostComments",
                column: "ParentCommentId",
                principalTable: "SocialPostComments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SocialPostComments_SocialPostComments_ParentCommentId",
                table: "SocialPostComments");

            migrationBuilder.DropIndex(
                name: "IX_SocialPostComments_ParentCommentId",
                table: "SocialPostComments");

            migrationBuilder.DropColumn(
                name: "ParentCommentId",
                table: "SocialPostComments");
        }
    }
}
