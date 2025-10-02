-- CreateTable
CREATE TABLE "public"."criminosos" (
    "id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "situacao" TEXT NOT NULL,
    "antecedentes" TEXT[],

    CONSTRAINT "criminosos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "criminosos_cpf_key" ON "public"."criminosos"("cpf");
