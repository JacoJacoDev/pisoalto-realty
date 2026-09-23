import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  X,
  Search,
  LogOut,
  Building,
  Home,
  Shield,
  FileText,
  Star
} from 'lucide-react';
import client, { getImageUrl } from '../api/client';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('properties'); // 'properties' | 'valuations' | 'contacts'
  const [properties, setProperties] = useState([]);
  const [valuations, setValuations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal / Form state for Create/Edit
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    operation_type: 'Venta',
    property_type: 'Casa',
    price: '',
    currency: 'USD',
    location: 'Córdoba Capital',
    address: '',
    description: '',
    bedrooms: 2,
    bathrooms: 1,
    surface_area: 100,
    features: '',
    contact_phone: '351-8-5555-88',
    contact_email: 'info@pisoaltorealty.com',
    is_published: true,
    is_featured: false
  });

  // Image Upload state for active editing property
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'properties') {
        const res = await client.get('/properties/admin/all');
        setProperties(res.data);
      } else if (activeTab === 'valuations') {
        const res = await client.get('/inquiries/valuation');
        setValuations(res.data);
      } else if (activeTab === 'contacts') {
        const res = await client.get('/inquiries/contact');
        setContacts(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProperty(null);
    setFormData({
      title: '',
      operation_type: 'Venta',
      property_type: 'Casa',
      price: '',
      currency: 'USD',
      location: 'Córdoba Capital',
      address: '',
      description: '',
      bedrooms: 2,
      bathrooms: 1,
      surface_area: 100,
      features: '',
      contact_phone: '351-8-5555-88',
      contact_email: 'info@pisoaltorealty.com',
      is_published: true,
      is_featured: false
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      operation_type: property.operation_type,
      property_type: property.property_type,
      price: property.price,
      currency: property.currency,
      location: property.location,
      address: property.address,
      description: property.description || '',
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      surface_area: property.surface_area,
      features: property.features || '',
      contact_phone: property.contact_phone || '',
      contact_email: property.contact_email || '',
      is_published: property.is_published,
      is_featured: property.is_featured
    });
    setShowModal(true);
  };

  const handleSaveProperty = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        surface_area: parseFloat(formData.surface_area) || 0
      };

      if (editingProperty) {
        await client.put(`/properties/${editingProperty.id}`, payload);
      } else {
        const res = await client.post('/properties', payload);
        // Prompt user to upload images for newly created property
        setEditingProperty(res.data);
      }
      fetchData();
      if (editingProperty) {
        setShowModal(false);
      }
    } catch (err) {
      alert('Error guardando la propiedad. Verifique los datos.');
    }
  };

  const handleTogglePublish = async (property) => {
    try {
      await client.put(`/properties/${property.id}`, {
        is_published: !property.is_published
      });
      fetchData();
    } catch (err) {
      alert('Error cambiando el estado de publicación.');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('¿Está seguro de eliminar esta propiedad? Esta acción no se puede deshacer.')) {
      try {
        await client.delete(`/properties/${propertyId}`);
        fetchData();
      } catch (err) {
        alert('Error eliminando la propiedad.');
      }
    }
  };

  // Real Image File Upload Handler
  const handleImageFileUpload = async (e) => {
    if (!editingProperty) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const uploadData = new FormData();
    for (let i = 0; i < files.length; i++) {
      uploadData.append('files', files[i]);
    }

    try {
      const res = await client.post(`/properties/${editingProperty.id}/images`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Update local editing property images
      const updatedPropRes = await client.get(`/properties/${editingProperty.id}`);
      setEditingProperty(updatedPropRes.data);
      fetchData();
    } catch (err) {
      alert('Error subiendo las imágenes.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!editingProperty) return;
    try {
      await client.delete(`/properties/${editingProperty.id}/images/${imageId}`);
      const updatedPropRes = await client.get(`/properties/${editingProperty.id}`);
      setEditingProperty(updatedPropRes.data);
      fetchData();
    } catch (err) {
      alert('Error eliminando la imagen.');
    }
  };

  const handleSetCoverImage = async (imageId) => {
    if (!editingProperty) return;
    try {
      await client.put(`/properties/${editingProperty.id}/images/${imageId}/cover`);
      const updatedPropRes = await client.get(`/properties/${editingProperty.id}`);
      setEditingProperty(updatedPropRes.data);
      fetchData();
    } catch (err) {
      alert('Error definiendo la imagen principal.');
    }
  };

  const filteredProperties = properties.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '90vh', paddingBottom: '4rem' }}>
      {/* Top Admin Header Bar */}
      <div style={{ backgroundColor: '#0c1836', color: '#ffffff', padding: '1.25rem 0', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield size={24} color="#60a5fa" />
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Panel de Administración</h1>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Conectado como: {user?.email}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/propiedades" target="_blank" className="btn-pill-outline" style={{ color: '#ffffff', borderColor: '#334155', fontSize: '0.85rem' }}>
              <Eye size={16} /> Ver sitio público ↗
            </Link>
            <button onClick={logout} style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: '0.5rem 1rem', borderRadius: '9999px', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <LogOut size={16} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2.5rem' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('properties')}
            className={`btn-pill-outline ${activeTab === 'properties' ? 'active' : ''}`}
            style={{ fontSize: '0.9rem', padding: '0.6rem 1.25rem' }}
          >
            <Building size={16} /> Propiedades ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('valuations')}
            className={`btn-pill-outline ${activeTab === 'valuations' ? 'active' : ''}`}
            style={{ fontSize: '0.9rem', padding: '0.6rem 1.25rem' }}
          >
            <FileText size={16} /> Solicitudes de Tasación ({valuations.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`btn-pill-outline ${activeTab === 'contacts' ? 'active' : ''}`}
            style={{ fontSize: '0.9rem', padding: '0.6rem 1.25rem' }}
          >
            <FileText size={16} /> Consultas de Contacto ({contacts.length})
          </button>
        </div>

        {/* TAB 1: PROPERTIES MANAGEMENT */}
        {activeTab === 'properties' && (
          <div>
            {/* Action & Search Bar */}
            <div className="card-rounded" style={{ padding: '1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ position: 'relative', minWidth: '280px', flexGrow: 1 }}>
                <input
                  type="text"
                  placeholder="Buscar propiedades por título, dirección o ciudad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
                <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              <button onClick={handleOpenCreateModal} className="btn-pill-navy" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}>
                <Plus size={18} /> Nueva Propiedad
              </button>
            </div>

            {/* Properties Table */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                Cargando gestión de propiedades...
              </div>
            ) : (
              <div className="card-rounded" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0c1836', color: '#ffffff' }}>
                      <th style={{ padding: '1rem 1.25rem' }}>Imagen</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Propiedad</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Operación</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Precio</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Ubicación</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Estado</th>
                      <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProperties.map((prop, idx) => {
                      const coverImg = prop.images && prop.images.length > 0
                        ? (prop.images.find(img => img.is_cover) || prop.images[0]).image_url
                        : null;

                      return (
                        <tr key={prop.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                          <td style={{ padding: '0.75rem 1.25rem' }}>
                            <div style={{ width: '56px', height: '42px', borderRadius: '0.35rem', overflow: 'hidden', backgroundColor: '#cbd5e1' }}>
                              <img src={getImageUrl(coverImg)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem 1.25rem' }}>
                            <span style={{ fontWeight: 700, color: '#0c1836', display: 'block' }}>{prop.title}</span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{prop.address}</span>
                          </td>
                          <td style={{ padding: '0.75rem 1.25rem' }}>
                            <span className="badge-operation" style={{ fontSize: '0.7rem' }}>{prop.operation_type}</span>
                          </td>
                          <td style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: '#0c1836' }}>
                            {prop.currency === 'USD' ? `U$S ${Number(prop.price).toLocaleString()}` : `$ ${Number(prop.price).toLocaleString()}`}
                          </td>
                          <td style={{ padding: '0.75rem 1.25rem', color: '#475569' }}>
                            {prop.location}
                          </td>
                          <td style={{ padding: '0.75rem 1.25rem' }}>
                            <button
                              onClick={() => handleTogglePublish(prop)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                border: 'none',
                                backgroundColor: prop.is_published ? '#dcfce7' : '#fef3c7',
                                color: prop.is_published ? '#15803d' : '#b45309'
                              }}
                            >
                              {prop.is_published ? 'Publicada' : 'Borrador'}
                            </button>
                          </td>
                          <td style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                              <Link to={`/propiedades/${prop.id}`} target="_blank" style={{ padding: '6px', color: '#2563eb' }} title="Previsualizar">
                                <Eye size={18} />
                              </Link>
                              <button onClick={() => handleOpenEditModal(prop)} style={{ padding: '6px', color: '#0f172a' }} title="Editar">
                                <Edit size={18} />
                              </button>
                              <button onClick={() => handleDeleteProperty(prop.id)} style={{ padding: '6px', color: '#ef4444' }} title="Eliminar">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VALUATION REQUESTS */}
        {activeTab === 'valuations' && (
          <div className="card-rounded" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0c1836', marginBottom: '1rem' }}>
              Solicitudes de Tasación Recibidas
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0c1836', color: '#ffffff' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Fecha</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Nombre</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Teléfono</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Tipo Propiedad</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Ciudad</th>
                  </tr>
                </thead>
                <tbody>
                  {valuations.map((v) => (
                    <tr key={v.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{new Date(v.created_at).toLocaleDateString('es-AR')}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{v.full_name}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{v.phone}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{v.property_type}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{v.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CONTACT INQUIRIES */}
        {activeTab === 'contacts' && (
          <div className="card-rounded" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0c1836', marginBottom: '1rem' }}>
              Consultas de Contacto
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0c1836', color: '#ffffff' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Fecha</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Nombre</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Teléfono / Email</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Interés</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{new Date(c.created_at).toLocaleDateString('es-AR')}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{c.first_name} {c.last_name || ''}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{c.phone} <br/><small style={{ color: '#64748b' }}>{c.email}</small></td>
                      <td style={{ padding: '0.75rem 1rem' }}>{c.service_interest}</td>
                      <td style={{ padding: '0.75rem 1rem', maxWidth: '300px' }}>{c.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT PROPERTY MODAL */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="card-rounded" style={{
            maxWidth: '750px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#64748b' }}
            >
              <X size={24} />
            </button>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0c1836', marginBottom: '1.5rem' }}>
              {editingProperty ? 'Editar Propiedad' : 'Crear Nueva Propiedad'}
            </h2>

            <form onSubmit={handleSaveProperty} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                  Título de la Propiedad
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                    Operación
                  </label>
                  <select
                    value={formData.operation_type}
                    onChange={(e) => setFormData({ ...formData, operation_type: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#fff' }}
                  >
                    <option value="Venta">Venta</option>
                    <option value="Alquiler">Alquiler</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                    Tipo de Propiedad
                  </label>
                  <select
                    value={formData.property_type}
                    onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#fff' }}
                  >
                    <option value="Casa">Casa</option>
                    <option value="Departamento">Departamento</option>
                    <option value="Cochera">Cochera</option>
                    <option value="Oficina">Oficina</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Local">Local</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                    Moneda
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#fff' }}
                  >
                    <option value="USD">USD (U$S)</option>
                    <option value="ARS">ARS ($)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                    Precio
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                    Ubicación / Ciudad
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                  Dirección Completa
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                    Dormitorios
                  </label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                    Baños
                  </label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                    Superficie (m²)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.surface_area}
                    onChange={(e) => setFormData({ ...formData, surface_area: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                  Descripción Detallada
                </label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                ></textarea>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                  Comodidades / Características (separadas por coma)
                </label>
                <input
                  type="text"
                  placeholder="Cochera, Patio, Balcón, Gas Natural, Seguridad"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  /> Publicar inmediatamente
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  /> Destacar en página de inicio
                </label>
              </div>

              {/* REAL IMAGE MANAGEMENT SECTION IF EDITING PROPERTY */}
              {editingProperty && (
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0c1836', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ImageIcon size={20} color="#2563eb" /> Imágenes de la Propiedad
                  </h4>

                  {/* Upload Drop Zone / Button */}
                  <div style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    textAlign: 'center',
                    backgroundColor: '#f8fafc',
                    marginBottom: '1rem'
                  }}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      id="image-file-input"
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="image-file-input" className="btn-pill-navy" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>
                      <Upload size={16} /> Subir Imágenes
                    </label>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                      Seleccione una o varias fotos (JPG, PNG, WEBP).
                    </p>
                    {uploadingImages && <p style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600, marginTop: '0.5rem' }}>Subiendo archivos...</p>}
                  </div>

                  {/* Existing Images Grid */}
                  {editingProperty.images && editingProperty.images.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem' }}>
                      {editingProperty.images.map((img) => (
                        <div key={img.id} style={{
                          position: 'relative',
                          height: '90px',
                          borderRadius: '0.5rem',
                          overflow: 'hidden',
                          border: img.is_cover ? '3px solid #2563eb' : '1px solid #cbd5e1'
                        }}>
                          <img src={getImageUrl(img.image_url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {img.is_cover && (
                            <span style={{ position: 'absolute', top: '4px', left: '4px', backgroundColor: '#2563eb', color: '#fff', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                              Principal
                            </span>
                          )}
                          <div style={{ position: 'absolute', bottom: '4px', right: '4px', display: 'flex', gap: '4px' }}>
                            {!img.is_cover && (
                              <button
                                type="button"
                                onClick={() => handleSetCoverImage(img.id)}
                                style={{ backgroundColor: 'rgba(12, 24, 54, 0.8)', color: '#fff', padding: '4px', borderRadius: '4px' }}
                                title="Hacer principal"
                              >
                                <Star size={12} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(img.id)}
                              style={{ backgroundColor: 'rgba(239, 68, 68, 0.85)', color: '#fff', padding: '4px', borderRadius: '4px' }}
                              title="Eliminar"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn-pill-navy" style={{ flexGrow: 1, padding: '0.75rem' }}>
                  {editingProperty ? 'Guardar Cambios' : 'Crear Propiedad'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-pill-outline" style={{ padding: '0.75rem 1.5rem' }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
