import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GalleryListProps {
  galleries: any[];
}

export default function GalleryList({ galleries }: GalleryListProps) {
  return (
    <div className="space-y-4">
      {galleries.map((gallery: any) => (
        <Card key={gallery.id}>
          <CardHeader>
            <CardTitle>{gallery.title}</CardTitle>
            <CardDescription>
              {gallery.description || "No description provided"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Items: {gallery.items.length}
            </p>
            <Badge variant="secondary" className="mt-2">
              {gallery.items.length > 0 ? "Active" : "Empty"}
            </Badge>
            <Button variant="outline" className="mt-4">
              <Link href={`/dashboard/galleries/${gallery.id}`}>Manage</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
