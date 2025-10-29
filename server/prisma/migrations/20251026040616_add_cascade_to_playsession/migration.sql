-- DropForeignKey
ALTER TABLE "public"."PlaySession" DROP CONSTRAINT "PlaySession_userId_fkey";

-- AddForeignKey
ALTER TABLE "PlaySession" ADD CONSTRAINT "PlaySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
