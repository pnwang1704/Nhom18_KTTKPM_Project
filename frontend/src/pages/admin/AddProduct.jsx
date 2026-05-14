import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Save,
  Plus,
  X,
  Upload,
  Trash2,
  Image as ImageIcon,
  Layers,
  Settings2,
  Zap,
  Info,
  Loader2,
  Sparkles,
  FileText
} from 'lucide-react';
import { cn } from '../../utils/admin-utils';
import { apiRequest, apiBaseUrl, apiUpload } from '../../services/api/client';

const AddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiRequest('/api/categories');
        const result = await res.json();
        if (result.success) {
          setCategories(result.data);
          // Set default category to first item if available
          if (result.data.length > 0 && !formData.category) {
            setFormData(prev => ({ ...prev, category: result.data[0].slug }));
          }
        }
      } catch (err) {
        console.error('Fetch categories error:', err);
      }
    };
    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    category: 'iphone',
    price: 0,
    stock: 0,
    description: '',
    image: '',
    images: [],
    variants: [],
    highlights: [],
    specifications: {}
  });

  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseNumber = (str) => {
    const num = Number(str.replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const response = await apiUpload('/api/products/upload', formDataUpload);
      const result = await response.json();
      if (result.success) {
        const imageUrl = result.data.imageUrl;
        setFormData(prev => ({
          ...prev,
          image: imageUrl,
          images: [imageUrl] // Đồng bộ với mảng images trong database
        }));
      } else {
        setError(result.message || 'Lỗi khi tải ảnh lên S3');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Lỗi kết nối khi tải ảnh');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        { colorName: '', colorCode: '', images: [], options: [{ storage: '', price: 0, stock: 0 }] }
      ]
    }));
  };

  const handleRemoveVariant = (vIndex) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== vIndex)
    }));
  };

  const handleAddHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, { title: '', description: '', image: '' }]
    }));
  };

  const handleHighlightChange = (index, field, value) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index][field] = value;
    setFormData(prev => ({ ...prev, highlights: newHighlights }));
  };

  const handleRemoveHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const handleAddSpec = () => {
    setFormData(prev => ({
      ...prev,
      specifications: { ...prev.specifications, "": "" }
    }));
  };

  const handleSpecChange = (oldKey, newKey, value) => {
    const newSpecs = { ...formData.specifications };
    if (oldKey !== newKey) {
      delete newSpecs[oldKey];
    }
    newSpecs[newKey] = value;
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const handleRemoveSpec = (key) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const handleVariantChange = (vIndex, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[vIndex][field] = value;
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const handleOptionChange = (vIndex, oIndex, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[vIndex].options[oIndex][field] = field === 'price' || field === 'stock' ? Number(value) : value;
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const handleAddOption = (vIndex) => {
    const newVariants = [...formData.variants];
    newVariants[vIndex].options.push({ storage: '', price: 0, stock: 0 });
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const handleVariantImageChange = async (vIndex, e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const uploadedUrls = [];

      for (const file of files) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        const response = await apiUpload('/api/products/upload', formDataUpload);

        const result = await response.json();
        if (result.success) {
          uploadedUrls.push(result.data.imageUrl);
        }
      }

      const newVariants = [...formData.variants];
      newVariants[vIndex].images = [...(newVariants[vIndex].images || []), ...uploadedUrls];
      setFormData(prev => ({ ...prev, variants: newVariants }));
    } catch (err) {
      setError('Lỗi khi tải ảnh sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const removeVariantImage = (vIndex, imgIndex) => {
    const newVariants = [...formData.variants];
    newVariants[vIndex].images = newVariants[vIndex].images.filter((_, i) => i !== imgIndex);
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const handleFillTestData = () => {
    setFormData({
      name: 'iPhone 15 Pro Max',
      category: 'iphone',
      price: 34990000,
      stock: 145,
      description: 'iPhone 15 Pro Max là mẫu iPhone mạnh mẽ nhất từ trước đến nay với thiết kế khung Titan chuẩn hàng không vũ trụ, chip A17 Pro đột phá mang lại hiệu năng chơi game đỉnh cao và hệ thống camera chuyên nghiệp 48MP.',
      image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800',
      images: [],
      variants: [
        {
          colorName: 'Titan Tự Nhiên',
          colorCode: '#8E8C87',
          images: [],
          options: [
            { storage: '256GB', price: 34990000, stock: 50 },
            { storage: '512GB', price: 40990000, stock: 30 }
          ]
        },
        {
          colorName: 'Titan Xanh',
          colorCode: '#2F3841',
          images: [],
          options: [
            { storage: '256GB', price: 34990000, stock: 40 },
            { storage: '512GB', price: 40990000, stock: 25 }
          ]
        }
      ],
      highlights: [],
      specifications: {
        "Vi xử lý": "A17 Pro chip",
        "Màn hình": "6.7-inch Super Retina XDR",
        "Camera": "Hệ thống camera Pro (48MP Chính)"
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Tính toán giá và tồn kho tổng từ các biến thể
    let totalStock = 0;
    let minPrice = Infinity;

    formData.variants.forEach(v => {
      v.options.forEach(o => {
        totalStock += Number(o.stock) || 0;
        if (o.price > 0 && o.price < minPrice) {
          minPrice = o.price;
        }
      });
    });

    const submissionData = {
      ...formData,
      price: minPrice === Infinity ? formData.price : minPrice,
      stock: totalStock
    };

    try {
      const response = await apiRequest('/api/products', {
        method: 'POST',
        body: JSON.stringify(submissionData)
      });

      const result = await response.json();
      if (result.success || response.status === 201) {
        navigate('/admin/products');
      } else {
        setError(result.message || 'Không thể tạo sản phẩm');
      }
    } catch (err) {
      setError('Lỗi kết nối hoặc dữ liệu không hợp lệ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Thêm sản phẩm mới</h1>
            <p className="text-muted-foreground text-sm">Tạo một mục mới trong danh mục sản phẩm của bạn.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleFillTestData}
            className="flex items-center gap-2 px-4 py-2 border border-primary/20 bg-primary/5 text-primary rounded-xl text-sm font-bold hover:bg-primary/10 transition-all"
          >
            <Zap className="w-4 h-4" />
            Dữ liệu mẫu
          </button>
          <button
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 border border-border rounded-xl text-sm font-bold hover:bg-muted transition-all"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : <><Save className="w-4 h-4" /> Lưu sản phẩm</>}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-2">
          <X className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <section className="bg-card p-8 rounded-3xl border border-border space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <Info className="w-5 h-5" />
              <h3 className="text-lg font-bold">Thông tin chung</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tên sản phẩm</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="VD: iPhone 15 Pro Max"
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Danh mục</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold capitalize text-foreground"
                >
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Mô tả chi tiết sản phẩm..."
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium h-32 resize-none text-foreground"
                />
              </div>
            </div>
          </section>

          {/* Variants & Pricing */}
          <section className="bg-card p-8 rounded-3xl border border-border space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Layers className="w-5 h-5" />
                <h3 className="text-lg font-bold">Màu sắc & Giá bán</h3>
              </div>
              <button
                onClick={handleAddVariant}
                className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3 h-3" /> Thêm màu sắc
              </button>
            </div>

            <div className="space-y-6">
              {formData.variants.map((variant, vIdx) => (
                <div key={vIdx} className="p-6 bg-muted/30 rounded-2xl border border-border space-y-4 relative group/variant">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase">Màu sắc #{vIdx + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(vIdx)}
                      className="p-2 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      title="Xóa màu sắc"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Tên màu sắc</label>
                      <input
                        type="text"
                        placeholder="Titan Xanh"
                        value={variant.colorName}
                        onChange={(e) => handleVariantChange(vIdx, 'colorName', e.target.value)}
                        className="w-full bg-card border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Mã màu (Hex)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="#000000"
                          value={variant.colorCode}
                          onChange={(e) => handleVariantChange(vIdx, 'colorCode', e.target.value)}
                          className="flex-1 bg-card border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-mono text-foreground"
                        />
                        <div className="w-10 h-10 rounded-lg border border-border shadow-inner" style={{ backgroundColor: variant.colorCode || '#eee' }} />
                      </div>
                    </div>
                  </div>

                  {/* Variant Images */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Hình ảnh theo màu</label>
                      <button
                        onClick={() => document.getElementById(`variant-upload-${vIdx}`).click()}
                        className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline"
                      >
                        <Plus className="w-3 h-3" /> Thêm ảnh
                      </button>
                      <input
                        id={`variant-upload-${vIdx}`}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => handleVariantImageChange(vIdx, e)}
                        accept="image/*"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {variant.images?.map((img, imgIdx) => (
                        <div key={imgIdx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border group">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeVariantImage(vIdx, imgIdx);
                            }}
                            className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {(!variant.images || variant.images.length === 0) && (
                        <div className="w-full py-4 border border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1">
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground font-medium">Chưa có ảnh</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">TÙY CHỌN (DUNG LƯỢNG & GIÁ)</label>
                      <button
                        type="button"
                        onClick={() => handleAddOption(vIdx)}
                        className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline"
                      >
                        <Plus className="w-3 h-3" /> Thêm dung lượng & giá
                      </button>
                    </div>
                    <div className="space-y-3">
                      {variant.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-end gap-3 bg-muted/30 p-4 rounded-2xl border border-border/50 relative group/option">
                          <div className="space-y-1.5 w-32">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                              <Layers className="w-3.5 h-3.5" /> Dung lượng
                            </label>
                            <input
                              type="text"
                              placeholder="256GB"
                              value={opt.storage}
                              onChange={(e) => handleOptionChange(vIdx, oIdx, 'storage', e.target.value)}
                              className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-foreground"
                            />
                          </div>
                          
                          <div className="space-y-1.5 flex-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                              <Zap className="w-3.5 h-3.5 text-amber-500" /> Đơn giá (VNĐ)
                            </label>
                            <input
                              type="text"
                              placeholder="Giá bán"
                              value={formatNumber(opt.price)}
                              onChange={(e) => handleOptionChange(vIdx, oIdx, 'price', parseNumber(e.target.value))}
                              className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
                            />
                          </div>
                          
                          <div className="space-y-1.5 w-32">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                              <Settings2 className="w-3.5 h-3.5" /> Tồn kho
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              value={opt.stock}
                              onChange={(e) => handleOptionChange(vIdx, oIdx, 'stock', e.target.value)}
                              className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-primary/10 transition-all text-foreground"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const newVariants = [...formData.variants];
                              newVariants[vIdx].options = newVariants[vIdx].options.filter((_, i) => i !== oIdx);
                              setFormData(prev => ({ ...prev, variants: newVariants }));
                            }}
                            className="p-2.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Xóa cấu hình"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {formData.variants.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-border rounded-2xl">
                  <p className="text-sm text-muted-foreground">Chưa có màu sắc nào. Nhấn "Thêm màu sắc" để bắt đầu.</p>
                </div>
              )}
            </div>
          </section>

          {/* Highlights */}
          <section className="bg-card p-8 rounded-3xl border border-border space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-lg font-bold">Đặc điểm nổi bật</h3>
              </div>
              <button
                type="button"
                onClick={handleAddHighlight}
                className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3 h-3" /> Thêm đặc điểm
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.highlights.map((item, index) => (
                <div key={index} className="p-6 bg-muted/30 rounded-2xl border border-border space-y-4 relative group">
                  <button
                    onClick={() => handleRemoveHighlight(index)}
                    className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Tiêu đề</label>
                      <input
                        type="text"
                        placeholder="VD: Sức mạnh từ Chip M4"
                        value={item.title}
                        onChange={(e) => handleHighlightChange(index, 'title', e.target.value)}
                        className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Mô tả chi tiết</label>
                      <textarea
                        placeholder="Nhập mô tả cho đặc điểm này..."
                        value={item.description}
                        onChange={(e) => handleHighlightChange(index, 'description', e.target.value)}
                        className="w-full bg-card border border-border rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-primary/10 transition-all min-h-[80px] text-foreground"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {formData.highlights.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-border rounded-2xl">
                  <p className="text-xs text-muted-foreground">Chưa có đặc điểm nổi bật nào.</p>
                </div>
              )}
            </div>
          </section>

          {/* Specifications */}
          <section className="bg-card p-8 rounded-3xl border border-border space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <FileText className="w-5 h-5" />
                <h3 className="text-lg font-bold">Thông số kỹ thuật</h3>
              </div>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3 h-3" /> Thêm thông số
              </button>
            </div>

            <div className="space-y-3">
              {Object.entries(formData.specifications).map(([key, value], index) => (
                <div key={index} className="flex gap-3 items-center group">
                  <input
                    type="text"
                    placeholder="Tên thông số (VD: RAM)"
                    value={key}
                    onChange={(e) => handleSpecChange(key, e.target.value, value)}
                    className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold text-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Giá trị (VD: 8GB)"
                    value={value}
                    onChange={(e) => handleSpecChange(key, key, e.target.value)}
                    className="flex-[2] bg-card border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-primary/10 transition-all text-foreground"
                  />
                  <button
                    onClick={() => handleRemoveSpec(key)}
                    className="p-2.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {Object.keys(formData.specifications).length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-border rounded-2xl">
                  <p className="text-xs text-muted-foreground">Chưa có thông số kỹ thuật nào.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          {/* Thumbnail */}
          <section className="bg-card p-6 rounded-3xl border border-border space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Ảnh sản phẩm</h3>
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <div
                onClick={triggerFileInput}
                className="aspect-square bg-muted rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/80 transition-all overflow-hidden group relative"
              >
                {uploading && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="text-[10px] font-bold text-primary uppercase">Đang tải lên...</span>
                  </div>
                )}

                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Tải ảnh lên</span>
                  </>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Link ảnh (URL)</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary/20 text-foreground"
                />
              </div>
            </div>
          </section>

          {/* Pricing Summary */}
          <section className="bg-card p-6 rounded-3xl border border-border space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2"><Settings2 className="w-4 h-4" /> Tóm tắt</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-medium">Giá cơ bản</span>
                <span className="font-bold">{formData.price?.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-medium">Số màu sắc</span>
                <span className="font-bold">{formData.variants.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-medium">Tổng tồn kho</span>
                <span className="font-bold text-primary">{formData.stock}</span>
              </div>
              <div className="pt-3 border-t border-border flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Sẵn sàng xuất bản</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
