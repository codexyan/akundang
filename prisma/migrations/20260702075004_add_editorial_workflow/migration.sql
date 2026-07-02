-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "category_id" TEXT,
ADD COLUMN     "review_notes" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "reviewed_by" TEXT,
ADD COLUMN     "scheduled_at" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft',
ADD COLUMN     "submitted_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "article_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "writer_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "avatar_url" TEXT NOT NULL DEFAULT '',
    "social_links" JSONB NOT NULL DEFAULT '{}',
    "is_trusted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "writer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "article_categories_name_key" ON "article_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "article_categories_slug_key" ON "article_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "writer_profiles_user_id_key" ON "writer_profiles"("user_id");

-- CreateIndex
CREATE INDEX "articles_status_idx" ON "articles"("status");

-- CreateIndex
CREATE INDEX "articles_category_id_idx" ON "articles"("category_id");

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "article_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "writer_profiles" ADD CONSTRAINT "writer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

