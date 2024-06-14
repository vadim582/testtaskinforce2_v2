using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LikesAndDislikes_pictures_PictureId",
                table: "LikesAndDislikes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LikesAndDislikes",
                table: "LikesAndDislikes");

            migrationBuilder.DropIndex(
                name: "IX_LikesAndDislikes_PictureId",
                table: "LikesAndDislikes");

            migrationBuilder.DropColumn(
                name: "DislikedUsername",
                table: "LikesAndDislikes");

            migrationBuilder.DropColumn(
                name: "LikedUsename",
                table: "LikesAndDislikes");

            migrationBuilder.RenameTable(
                name: "LikesAndDislikes",
                newName: "likes");

            migrationBuilder.AddColumn<bool>(
                name: "IsLike",
                table: "likes",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "likes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_likes",
                table: "likes",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_likes_PictureId",
                table: "likes",
                column: "PictureId");

            migrationBuilder.CreateIndex(
                name: "IX_likes_UserId_PictureId",
                table: "likes",
                columns: new[] { "UserId", "PictureId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_likes_pictures_PictureId",
                table: "likes",
                column: "PictureId",
                principalTable: "pictures",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_likes_users_UserId",
                table: "likes",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_likes_pictures_PictureId",
                table: "likes");

            migrationBuilder.DropForeignKey(
                name: "FK_likes_users_UserId",
                table: "likes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_likes",
                table: "likes");

            migrationBuilder.DropIndex(
                name: "IX_likes_PictureId",
                table: "likes");

            migrationBuilder.DropIndex(
                name: "IX_likes_UserId_PictureId",
                table: "likes");

            migrationBuilder.DropColumn(
                name: "IsLike",
                table: "likes");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "likes");

            migrationBuilder.RenameTable(
                name: "likes",
                newName: "LikesAndDislikes");

            migrationBuilder.AddColumn<string>(
                name: "DislikedUsername",
                table: "LikesAndDislikes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LikedUsename",
                table: "LikesAndDislikes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_LikesAndDislikes",
                table: "LikesAndDislikes",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_LikesAndDislikes_PictureId",
                table: "LikesAndDislikes",
                column: "PictureId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_LikesAndDislikes_pictures_PictureId",
                table: "LikesAndDislikes",
                column: "PictureId",
                principalTable: "pictures",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
