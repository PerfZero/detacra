import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  Camera,
  CameraOff,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import type { RegulationTableRow } from "../types";

type RegulationsSectionProps = {
  rows: RegulationTableRow[];
};

export const RegulationsSection = ({ rows }: RegulationsSectionProps) => {
  return (
    <section>
      <Card className="rounded-2xl shadow-none">
        <CardHeader>
          <CardTitle className="text-xl block  font-semibold leading-none tracking-tight">
            Регламенты
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 px-0 pb-0">
          <div className="flex items-center justify-between gap-4 border-t px-6 pt-4">
            <div className="relative w-full max-w-[280px]">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Быстрый поиск..." className="pl-9" />
            </div>

            <div className="flex items-center gap-3">
              <Select defaultValue="5">
                <SelectTrigger className="h-10 w-[72px]">
                  <SelectValue placeholder="5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>

              <Button className="gap-2">
                Добавить регламент
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          <div className="border-y">
            <Table className="min-w-[1300px]">
              <TableHeader>
                <TableRow className="text-left text-sm text-muted-foreground">
                  <TableHead className="px-5 py-4 font-medium">
                    <span className="inline-flex items-center gap-2">
                      Номер
                      <ArrowUpDown className="size-4" />
                    </span>
                  </TableHead>
                  <TableHead className="min-w-[220px] px-3 py-4 font-medium">
                    <span className="inline-flex items-center gap-2">
                      Название
                      <ArrowUpDown className="size-4" />
                    </span>
                  </TableHead>
                  <TableHead className="min-w-[520px] px-3 py-4 font-medium">
                    <span className="inline-flex items-center gap-2">
                      Описание
                      <ArrowUpDown className="size-4" />
                    </span>
                  </TableHead>
                  <TableHead className="min-w-[180px] px-3 py-4 font-medium whitespace-nowrap">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      Время / интервал
                      <ArrowUpDown className="size-4" />
                    </span>
                  </TableHead>
                  <TableHead className="min-w-[170px] px-3 py-4 font-medium">
                    Фотоотчеты
                  </TableHead>
                  <TableHead className="px-3 py-4 font-medium">
                    Действие
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} className="text-sm">
                    <TableCell className="px-5 py-3 text-sm text-muted-foreground">
                      {row.id}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-sm font-semibold">
                      {row.name}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-sm text-muted-foreground">
                      <p
                        className="overflow-hidden leading-4"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {row.description}
                      </p>
                    </TableCell>
                    <TableCell className="px-3 py-3 text-sm whitespace-nowrap">
                      {row.timeInterval}
                    </TableCell>
                    <TableCell className="px-3 py-3">
                      <span className="inline-flex items-center gap-2 text-base text-muted-foreground">
                        <span className="inline-flex rounded-full bg-muted p-2">
                          {row.photoRequired ? (
                            <Camera className="size-4" />
                          ) : (
                            <CameraOff className="size-4" />
                          )}
                        </span>
                        {row.photoRequired ? "Требуется" : "Не требуется"}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Eye className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between px-6">
            <p className="text-sm text-muted-foreground">Показывать 5 из 205</p>

            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">4</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
