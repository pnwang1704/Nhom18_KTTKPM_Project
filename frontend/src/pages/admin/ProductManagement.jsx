import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { 
  Search, 
  Plus, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Download,
  ArrowUpDown,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/admin-utils';
import { apiRequest } from '../../services/api/client';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null });
  const [deleting, setDeleting] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('/api/products?limit=100');
      const result = await response.json();
      const data = result.products || result.data || (Array.isArray(result) ? result : []);
      setTotalProducts(result.pagination?.total || data.length);
      
      // Map data to ensure it has all fields for the table
      const mappedData = data.map(p => ({
        ...p,
        id: p._id,
        image: p.image || (p.images && p.images[0]) || (p.variants && p.variants[0]?.images[0]) || 'https://via.placeholder.com/100',
        stock: p.stock !== undefined ? p.stock : (p.variants?.reduce((vSum, v) => vSum + (v.options?.reduce((oSum, o) => oSum + (Number(o.stock) || 0), 0) || 0), 0) || 0),
        status: (p.stock > 20 || (p.variants?.some(v => v.options?.some(o => o.stock > 20)))) ? 'Đang hoạt động' : 
                (p.stock > 0 || (p.variants?.some(v => v.options?.some(o => o.stock > 0)))) ? 'Sắp hết hàng' : 'Hết hàng'
      }));
      
      setProducts(mappedData);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteModal.product) return;

    setDeleting(true);
    try {
      const response = await apiRequest(`/api/products/${deleteModal.product.id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (result.success) {
        setProducts(prev => prev.filter(p => p._id !== deleteModal.product.id));
        setDeleteModal({ open: false, product: null });
      } else {
        alert(result.message || 'Không thể xóa sản phẩm');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Lỗi kết nối khi xóa sản phẩm');
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
  }, [products, selectedCategory]);

  const columns = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <button 
          className="flex items-center gap-1 hover:text-primary transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Sản phẩm
          <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden border border-border">
            <img 
              src={row.original.image} 
              alt={row.original.name} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/100' }}
            />
          </div>
          <div>
            <p className="text-sm font-bold text-elppa-obsidian line-clamp-1">{row.original.name}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{row.original.brand}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Giá',
      cell: ({ row }) => <span className="text-sm font-bold tracking-tight">{row.original.price?.toLocaleString()}₫</span>,
    },
    {
      accessorKey: 'stock',
      header: 'Kho hàng',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full",
                row.original.stock > 20 ? "bg-emerald-500" : row.original.stock > 0 ? "bg-orange-500" : "bg-rose-500"
              )} 
              style={{ width: `${Math.min(row.original.stock * 2, 100)}%` }} 
            />
          </div>
          <span className="text-xs font-bold">{row.original.stock}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const status = row.original.status;
        const color = status === 'Đang hoạt động' ? 'text-emerald-600 bg-emerald-50' : status === 'Sắp hết hàng' ? 'text-orange-600 bg-orange-50' : 'text-rose-600 bg-rose-50';
        return (
          <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", color)}>
            {status}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link 
            to={`/admin/products/edit/${row.original.id}`}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-all"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => setDeleteModal({ open: true, product: { id: row.original.id, name: row.original.name } })}
            className="p-2 rounded-lg hover:bg-rose-50 text-muted-foreground hover:text-rose-600 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data: filteredProducts,
    columns,
    state: {
      globalFilter,
      sorting,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sản phẩm</h1>
          <p className="text-muted-foreground mt-1">Quản lý danh mục, giá cả và mức tồn kho của bạn.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-bold hover:bg-muted transition-all">
            <Download className="w-4 h-4" />
            Xuất file
          </button>
          <Link 
            to="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
        {/* Table Filters */}
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 pr-4 py-2 bg-card border border-border rounded-xl w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-border bg-card rounded-xl text-sm font-bold hover:bg-muted transition-all">
              <Filter className="w-4 h-4 text-muted-foreground" />
              Bộ lọc
            </button>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-border bg-card rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all capitalize"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="iphone">iPhone</option>
              <option value="ipad">iPad</option>
              <option value="samsung">Samsung</option>
              <option value="oppo">Oppo</option>
              <option value="xiaomi">Xiaomi</option>
            </select>
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto min-h-[400px] relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-card/50 z-10 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4">
                 <Loader2 className="w-10 h-10 text-primary animate-spin" />
                 <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Đang tải sản phẩm...</p>
              </div>
            </div>
          ) : null}
          
          <table className="w-full text-left">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-muted/30 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-8 py-5">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {!loading && table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <p className="text-muted-foreground font-medium">Không tìm thấy sản phẩm nào.</p>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <motion.tr 
                    layout
                    key={row.id} 
                    className={cn(
                      "hover:bg-muted/30 transition-colors group",
                      row.getIsSelected() && "bg-primary/5"
                    )}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-8 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/10">
          <p className="text-sm text-muted-foreground font-medium">
            Hiển thị <span className="font-bold text-foreground">{table.getRowModel().rows.length}</span> trong tổng số <span className="font-bold text-foreground">{totalProducts}</span> sản phẩm
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[...Array(table.getPageCount())].map((_, i) => (
              <button 
                key={i}
                onClick={() => table.setPageIndex(i)}
                className={cn(
                  "w-8 h-8 rounded-lg text-sm font-bold transition-all",
                  table.getState().pagination.pageIndex === i 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setDeleteModal({ open: false, product: null })}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card border border-border rounded-[2rem] shadow-2xl p-8 space-y-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8 text-rose-600" />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">Xác nhận xóa sản phẩm?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bạn đang yêu cầu xóa sản phẩm <span className="font-bold text-foreground">"{deleteModal.product?.name}"</span>. 
                  Hành động này sẽ xóa vĩnh viễn dữ liệu và không thể hoàn tác.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  disabled={deleting}
                  onClick={() => setDeleteModal({ open: false, product: null })}
                  className="px-4 py-3 border border-border rounded-xl text-sm font-bold hover:bg-muted transition-all disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  disabled={deleting}
                  onClick={handleDeleteProduct}
                  className="px-4 py-3 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang xóa...
                    </>
                  ) : 'Xác nhận xóa'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManagement;
