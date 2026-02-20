import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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
import { cn } from "@/lib/utils";
import { ArrowUpDown, Search } from "lucide-react";

type WarehouseSortField = "article" | "category" | "name" | "stock";
type SortDirection = "asc" | "desc";

type WarehouseRow = {
  article: string;
  category: string;
  name: string;
  stock: number;
};

const BASE_ROWS: WarehouseRow[] = [
  {
    article: "5099",
    category: "Напитки",
    name: "Напиток Добрый Апельсин газированный, 500мл",
    stock: 234,
  },
  {
    article: "5008",
    category: "Напитки",
    name: "Напиток Добрый Cola Ваниль газированный, 500мл",
    stock: 333,
  },
  {
    article: "5101",
    category: "Напитки",
    name: "Напиток Добрый Киви-виноград газированный, 500мл",
    stock: 211,
  },
  {
    article: "4586",
    category: "Напитки",
    name: "Напиток Добрый Cola без сахара газированный, 500мл",
    stock: 321,
  },
  {
    article: "4360",
    category: "Еда",
    name: "Чипсы Lay's Stax Пикантная паприка, 140г",
    stock: 50,
  },
];

const WAREHOUSE_ROWS: WarehouseRow[] = Array.from(
  { length: 205 },
  (_, index) => {
    if (index < BASE_ROWS.length) {
      return BASE_ROWS[index];
    }

    const template = BASE_ROWS[index % BASE_ROWS.length];
    return {
      ...template,
      article: String(6000 + index),
      stock: template.stock + (index % 7) * 3,
    };
  },
);

const buildPageNumbers = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages] as const;
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ] as const;
};

export const WarehousePageSection = () => {
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<WarehouseSortField>("article");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return WAREHOUSE_ROWS;
    }

    return WAREHOUSE_ROWS.filter((row) =>
      `${row.article} ${row.category} ${row.name}`
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [searchValue]);

  const sortedRows = useMemo(() => {
    const rows = [...filteredRows];
    const direction = sortDirection === "asc" ? 1 : -1;

    rows.sort((left, right) => {
      if (sortField === "stock") {
        return (left.stock - right.stock) * direction;
      }

      if (sortField === "article") {
        return (Number(left.article) - Number(right.article)) * direction;
      }

      const leftValue = left[sortField];
      const rightValue = right[sortField];
      return (
        leftValue.localeCompare(rightValue, "ru", { sensitivity: "base" }) *
        direction
      );
    });

    return rows;
  }, [filteredRows, sortDirection, sortField]);

  const totalItems = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pageRows = sortedRows.slice(startIndex, endIndex);
  const pageNumbers = buildPageNumbers(currentPage, totalPages);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, searchValue, sortDirection, sortField]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSort = (field: WarehouseSortField) => {
    if (field === sortField) {
      setSortDirection((previous) => (previous === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);
    setSortDirection("asc");
  };

  const renderSortableHeader = (label: string, field: WarehouseSortField) => (
    <button
      type="button"
      className="inline-flex items-center gap-2 whitespace-nowrap text-left"
      onClick={() => handleSort(field)}
      aria-label={`Сортировать по ${label}`}
    >
      {label}
      <ArrowUpDown
        className={cn(
          "size-4",
          sortField === field ? "text-foreground" : "text-muted-foreground",
        )}
      />
    </button>
  );

  return (
    <section>
      <div className="overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-none">
        <div className="border-b px-6 py-6">
          <h2 className="text-xl font-semibold tracking-tight">
            Склад (56 товаров)
          </h2>
        </div>

        <div className="flex items-center justify-between gap-4 border-b px-6 py-4">
          <div className="relative w-full max-w-[340px]">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Быстрый поиск..."
              className="pl-9"
            />
          </div>

          <Select
            value={String(pageSize)}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="w-[84px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border-b">
          <Table>
            <TableHeader>
              <TableRow className="text-left text-sm text-muted-foreground">
                <TableHead className="w-[160px] px-5 py-4 font-medium">
                  {renderSortableHeader("Артикул", "article")}
                </TableHead>
                <TableHead className="w-[180px] px-3 py-4 font-medium">
                  {renderSortableHeader("Категория", "category")}
                </TableHead>
                <TableHead className="min-w-[460px] px-3 py-4 font-medium">
                  {renderSortableHeader("Наименование товара", "name")}
                </TableHead>
                <TableHead className="w-[220px] text-center px-3 py-4  font-medium">
                  <span className="inline-flex items-center gap-2">
                    Остаток на складе
                    <ArrowUpDown className="size-4 text-muted-foreground" />
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pageRows.map((row) => (
                <TableRow key={row.article}>
                  <TableCell className="px-5 py-3 text-sm text-muted-foreground">
                    {row.article}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-sm text-muted-foreground">
                    {row.category}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-sm font-medium">
                    {row.name}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-center  text-sm text-muted-foreground">
                    {row.stock}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Показывать {pageRows.length} из {totalItems}
          </p>

          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={cn(
                    currentPage === 1 && "pointer-events-none opacity-50",
                  )}
                  onClick={(event) => {
                    event.preventDefault();
                    setCurrentPage((previous) => Math.max(1, previous - 1));
                  }}
                />
              </PaginationItem>

              {pageNumbers.map((page, index) => (
                <PaginationItem key={`${page}-${index}`}>
                  {page === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(event) => {
                        event.preventDefault();
                        setCurrentPage(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  className={cn(
                    currentPage === totalPages &&
                      "pointer-events-none opacity-50",
                  )}
                  onClick={(event) => {
                    event.preventDefault();
                    setCurrentPage((previous) =>
                      Math.min(totalPages, previous + 1),
                    );
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </section>
  );
};
