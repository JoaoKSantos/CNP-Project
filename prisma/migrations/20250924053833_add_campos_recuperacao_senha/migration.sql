-- AlterTable
ALTER TABLE "public"."usuarios" ADD COLUMN     "dataExpiraToken" TIMESTAMP(3),
ADD COLUMN     "tokenRecuperacao" TEXT;
