import { Github } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold">Ecommerce Spin Test</span>
            </p>
            <span className="hidden text-muted-foreground md:inline">•</span>
            <p className="text-sm text-muted-foreground">
              Hecho por{" "}
              <Link
                href="https://rafaelcetina.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium"
              >
                Rafael Cetina
              </Link>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="https://github.com/rafaelcetina/spin-test"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">Ver código</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
