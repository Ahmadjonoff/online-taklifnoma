-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "options" TEXT NOT NULL DEFAULT '{}';

-- CreateTable
CREATE TABLE "_TemplateCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TemplateCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TemplateCategories_B_index" ON "_TemplateCategories"("B");

-- AddForeignKey
ALTER TABLE "_TemplateCategories" ADD CONSTRAINT "_TemplateCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TemplateCategories" ADD CONSTRAINT "_TemplateCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

