'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaCalendarDay,
  FaCheck,
  FaEnvelope,
  FaEnvelopeOpen,
  FaEye,
  FaLink,
  FaReply,
  FaSave,
  FaSearch,
  FaTrash,
} from 'react-icons/fa';
import type { Contact, HomeSection, SocialLink } from '@/types';
import {
  createAdminResource,
  deleteAdminResource,
  fetchAdminResource,
  updateAdminResource,
} from '@/lib/adminResourceClient';
import { formatDate, truncateText } from '@/utils/helpers';

type FilterStatus = 'all' | 'unread' | 'read' | 'responded' | 'not_responded';

type ContactSettingKey = 'location' | 'email' | 'phone';

type ContactSetting = {
  id: string | null;
  content: string;
  display_order: number;
};

type SocialForm = {
  platform: string;
  url: string;
  icon_class: string;
  display_order: number;
  is_active: boolean;
};

const contactSettingConfig: Array<{
  key: ContactSettingKey;
  label: string;
  order: number;
}> = [
  { key: 'location', label: 'Location', order: 90 },
  { key: 'email', label: 'Email', order: 91 },
  { key: 'phone', label: 'Phone', order: 92 },
];

const defaultSocialForm: SocialForm = {
  platform: '',
  url: '',
  icon_class: '',
  display_order: 0,
  is_active: true,
};

function buildDefaultContactSettings() {
  return contactSettingConfig.reduce(
    (acc, item) => ({
      ...acc,
      [item.key]: {
        id: null,
        content: '',
        display_order: item.order,
      },
    }),
    {} as Record<ContactSettingKey, ContactSetting>,
  );
}

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<Contact[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [contactSettings, setContactSettings] = useState<
    Record<ContactSettingKey, ContactSetting>
  >(buildDefaultContactSettings());

  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Contact | null>(null);

  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [socialForm, setSocialForm] = useState<SocialForm>(defaultSocialForm);

  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadData = useCallback(async () => {
    setError('');
    try {
      const [messageData, socialData, homeData] = await Promise.all([
        fetchAdminResource<Contact>('messages'),
        fetchAdminResource<SocialLink>('social'),
        fetchAdminResource<HomeSection>('home'),
      ]);

      setMessages(messageData);
      setSocialLinks(socialData);

      const nextSettings = buildDefaultContactSettings();
      contactSettingConfig.forEach(({ key, order }) => {
        const existing = homeData.find(
          (section) => section.section_name.toLowerCase() === key,
        );
        if (existing) {
          nextSettings[key] = {
            id: existing.id,
            content: existing.content,
            display_order: existing.display_order,
          };
          return;
        }

        nextSettings[key] = {
          id: null,
          content: '',
          display_order: order,
        };
      });

      setContactSettings(nextSettings);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load contacts data.');
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();
  }, [loadData]);

  const filteredMessages = useMemo(() => {
    const loweredSearch = searchQuery.toLowerCase();

    return messages.filter((message) => {
      const responded = message.is_archived;
      const matchesFilter =
        statusFilter === 'all'
          ? true
          : statusFilter === 'unread'
            ? !message.is_read
            : statusFilter === 'read'
              ? message.is_read
              : statusFilter === 'responded'
                ? responded
                : !responded;

      const matchesSearch =
        message.name.toLowerCase().includes(loweredSearch)
        || message.email.toLowerCase().includes(loweredSearch)
        || message.subject.toLowerCase().includes(loweredSearch);

      return matchesFilter && matchesSearch;
    });
  }, [messages, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();

    return {
      total: messages.length,
      unread: messages.filter((message) => !message.is_read).length,
      responded: messages.filter((message) => message.is_archived).length,
      today: messages.filter(
        (message) => new Date(message.created_at).toDateString() === today,
      ).length,
    };
  }, [messages]);

  const markAsRead = async (id: string) => {
    try {
      await updateAdminResource<Contact>('messages', id, { is_read: true });
      await loadData();
      if (selectedMessage?.id === id) {
        setSelectedMessage((current) => (current ? { ...current, is_read: true } : current));
      }
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Failed to update message.');
    }
  };

  const markAsResponded = async (id: string) => {
    try {
      await updateAdminResource<Contact>('messages', id, {
        is_read: true,
        is_archived: true,
      });
      await loadData();
      if (selectedMessage?.id === id) {
        setSelectedMessage((current) =>
          current
            ? {
                ...current,
                is_read: true,
                is_archived: true,
              }
            : current,
        );
      }
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Failed to update message.');
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await deleteAdminResource('messages', id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete message.');
    }
  };

  const openMessage = async (message: Contact) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      await markAsRead(message.id);
    }
  };

  const saveContactSettings = async () => {
    setError('');
    setNotice('');
    try {
      for (const item of contactSettingConfig) {
        const setting = contactSettings[item.key];
        const content = setting.content.trim();

        if (setting.id) {
          await updateAdminResource<HomeSection>('home', setting.id, {
            section_name: item.key,
            content,
            image_path: null,
            display_order: setting.display_order,
            is_active: true,
            updated_at: new Date().toISOString(),
          });
        } else if (content) {
          await createAdminResource<HomeSection>('home', {
            section_name: item.key,
            content,
            image_path: null,
            display_order: setting.display_order,
            is_active: true,
          });
        }
      }

      setNotice('Contact profile updated.');
      await loadData();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : 'Failed to save contact profile.',
      );
    }
  };

  const resetSocialForm = () => {
    setEditingSocialId(null);
    setSocialForm(defaultSocialForm);
  };

  const startEditSocial = (link: SocialLink) => {
    setEditingSocialId(link.id);
    setSocialForm({
      platform: link.platform,
      url: link.url,
      icon_class: link.icon_class,
      display_order: link.display_order,
      is_active: link.is_active,
    });
  };

  const saveSocialLink = async () => {
    if (!socialForm.platform.trim() || !socialForm.url.trim()) {
      setError('Social platform and URL are required.');
      return;
    }

    setError('');
    setNotice('');
    const payload = {
      platform: socialForm.platform.trim(),
      url: socialForm.url.trim(),
      icon_class: socialForm.icon_class.trim(),
      display_order: socialForm.display_order,
      is_active: socialForm.is_active,
    };

    try {
      if (editingSocialId) {
        await updateAdminResource<SocialLink>('social', editingSocialId, payload);
      } else {
        await createAdminResource<SocialLink>('social', payload);
      }
      resetSocialForm();
      setNotice('Social links updated.');
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save social link.');
    }
  };

  const deleteSocialLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social link?')) {
      return;
    }

    try {
      await deleteAdminResource('social', id);
      if (editingSocialId === id) {
        resetSocialForm();
      }
      setNotice('Social link deleted.');
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete social link.');
    }
  };

  return (
    <>
      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h1 className="admin-card-title">Contact Messages</h1>
            <p className="admin-card-subtitle">
              Manage and respond to contact messages from your portfolio.
            </p>
          </div>
          <div className="admin-stat-icon">
            <FaEnvelope />
          </div>
        </div>

        <div
          className="admin-dashboard-grid"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}
        >
          <article className="admin-stat-card">
            <div className="admin-stat-icon">
              <FaEnvelope />
            </div>
            <div className="admin-stat-value">{stats.total}</div>
            <div className="admin-stat-label">Total Messages</div>
          </article>
          <article className="admin-stat-card">
            <div className="admin-stat-icon">
              <FaEnvelopeOpen />
            </div>
            <div className="admin-stat-value">{stats.unread}</div>
            <div className="admin-stat-label">Unread Messages</div>
          </article>
          <article className="admin-stat-card">
            <div className="admin-stat-icon">
              <FaReply />
            </div>
            <div className="admin-stat-value">{stats.responded}</div>
            <div className="admin-stat-label">Responded</div>
          </article>
          <article className="admin-stat-card">
            <div className="admin-stat-icon">
              <FaCalendarDay />
            </div>
            <div className="admin-stat-value">{stats.today}</div>
            <div className="admin-stat-label">Today</div>
          </article>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">Contact Profile</h2>
            <p className="admin-card-subtitle">
              Controls the visible contact details on `/contact`.
            </p>
          </div>
        </div>

        <div className="admin-form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {contactSettingConfig.map((item) => (
            <div key={item.key} className="admin-form-group">
              <label className="admin-form-label">{item.label}</label>
              <input
                className="admin-form-input"
                value={contactSettings[item.key].content}
                onChange={(event) =>
                  setContactSettings((current) => ({
                    ...current,
                    [item.key]: {
                      ...current[item.key],
                      content: event.target.value,
                    },
                  }))
                }
                placeholder={`Enter ${item.label.toLowerCase()}`}
              />
            </div>
          ))}
        </div>

        <div className="admin-form-actions">
          <button className="admin-btn admin-btn-primary" type="button" onClick={saveContactSettings}>
            <FaSave />
            Save Contact Profile
          </button>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">
              {editingSocialId ? 'Edit Social Link' : 'Add Social Link'}
            </h2>
            <p className="admin-card-subtitle">
              Manage footer/contact social links used on the client side.
            </p>
          </div>
          <div className="admin-stat-icon">
            <FaLink />
          </div>
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label className="admin-form-label">Platform *</label>
            <input
              className="admin-form-input"
              value={socialForm.platform}
              onChange={(event) =>
                setSocialForm((currentForm) => ({
                  ...currentForm,
                  platform: event.target.value,
                }))
              }
              placeholder="GitHub, LinkedIn, Email"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">URL *</label>
            <input
              className="admin-form-input"
              value={socialForm.url}
              onChange={(event) =>
                setSocialForm((currentForm) => ({
                  ...currentForm,
                  url: event.target.value,
                }))
              }
              placeholder="https://github.com/username or mailto:you@example.com"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Icon Class</label>
            <input
              className="admin-form-input"
              value={socialForm.icon_class}
              onChange={(event) =>
                setSocialForm((currentForm) => ({
                  ...currentForm,
                  icon_class: event.target.value,
                }))
              }
              placeholder="FaGithub, FaLinkedin, FaEnvelope"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Display Order</label>
            <input
              className="admin-form-input"
              type="number"
              value={socialForm.display_order}
              onChange={(event) =>
                setSocialForm((currentForm) => ({
                  ...currentForm,
                  display_order: Number(event.target.value) || 0,
                }))
              }
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Status</label>
            <select
              className="admin-form-select"
              value={socialForm.is_active ? 'active' : 'inactive'}
              onChange={(event) =>
                setSocialForm((currentForm) => ({
                  ...currentForm,
                  is_active: event.target.value === 'active',
                }))
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="admin-form-actions">
          <button className="admin-btn admin-btn-primary" type="button" onClick={saveSocialLink}>
            <FaSave />
            {editingSocialId ? 'Save Social Link' : 'Add Social Link'}
          </button>
          <button className="admin-btn admin-btn-secondary" type="button" onClick={resetSocialForm}>
            Cancel
          </button>
          {editingSocialId && (
            <button
              className="admin-btn admin-btn-danger"
              type="button"
              onClick={() => deleteSocialLink(editingSocialId)}
            >
              <FaTrash />
              Delete
            </button>
          )}
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">Social Links</h2>
            <p className="admin-card-subtitle">Active and archived social platforms.</p>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Platform</th>
                <th>URL</th>
                <th>Icon</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {socialLinks.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-empty-state">
                    No social links found.
                  </td>
                </tr>
              )}
              {socialLinks.map((social) => (
                <tr key={social.id}>
                  <td>{social.platform}</td>
                  <td>{truncateText(social.url, 70)}</td>
                  <td>{social.icon_class || '—'}</td>
                  <td>{social.display_order}</td>
                  <td>
                    <span className={`admin-status-chip ${social.is_active ? 'success' : 'warning'}`}>
                      {social.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="admin-btn admin-btn-secondary"
                      type="button"
                      style={{ marginRight: '0.5rem', padding: '0.4rem 0.6rem' }}
                      onClick={() => startEditSocial(social)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="admin-btn admin-btn-danger"
                      type="button"
                      style={{ padding: '0.4rem 0.6rem' }}
                      onClick={() => deleteSocialLink(social.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">Filter & Actions</h2>
            <p className="admin-card-subtitle">Filter by status and search by name/email/subject.</p>
          </div>
        </div>

        <div className="admin-form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Filter by Status</label>
            <select
              className="admin-form-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as FilterStatus)}
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
              <option value="responded">Responded</option>
              <option value="not_responded">Not Responded</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Search Messages</label>
            <div style={{ position: 'relative' }}>
              <FaSearch style={{ position: 'absolute', left: '0.9rem', top: '0.85rem', color: 'var(--admin-text-muted)' }} />
              <input
                className="admin-form-input"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name, email, subject..."
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">Messages</h2>
            <p className="admin-card-subtitle">All contact messages from your portfolio.</p>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Contact Info</th>
                <th>Subject & Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.length === 0 && (
                <tr>
                  <td colSpan={4} className="admin-empty-state">
                    No messages found.
                  </td>
                </tr>
              )}
              {filteredMessages.map((message) => (
                <tr key={message.id}>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span className={`admin-status-chip ${message.is_read ? 'success' : 'danger'}`}>
                        {message.is_read ? 'Read' : 'Unread'}
                      </span>
                      {message.is_archived && (
                        <span className="admin-status-chip warning">Responded</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>{message.name}</div>
                    <div style={{ color: 'var(--admin-primary)', fontSize: '0.8rem' }}>{message.email}</div>
                    <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>
                      {formatDate(message.created_at)}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{message.subject || 'No Subject'}</div>
                    <div style={{ color: 'var(--admin-text-secondary)' }}>
                      {truncateText(message.message, 120)}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <button
                        className="admin-btn admin-btn-secondary"
                        type="button"
                        style={{ padding: '0.4rem 0.55rem' }}
                        onClick={() => openMessage(message)}
                        title="View"
                      >
                        <FaEye />
                      </button>
                      {!message.is_read && (
                        <button
                          className="admin-btn admin-btn-secondary"
                          type="button"
                          style={{ padding: '0.4rem 0.55rem' }}
                          onClick={() => markAsRead(message.id)}
                          title="Mark as Read"
                        >
                          <FaCheck />
                        </button>
                      )}
                      {!message.is_archived && (
                        <button
                          className="admin-btn admin-btn-secondary"
                          type="button"
                          style={{ padding: '0.4rem 0.55rem' }}
                          onClick={() => markAsResponded(message.id)}
                          title="Mark as Responded"
                        >
                          <FaReply />
                        </button>
                      )}
                      <button
                        className="admin-btn admin-btn-danger"
                        type="button"
                        style={{ padding: '0.4rem 0.55rem' }}
                        onClick={() => deleteMessage(message.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                      <a
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '0.4rem 0.55rem', textDecoration: 'none' }}
                        href={`mailto:${message.email}`}
                        title="Reply by Email"
                      >
                        <FaEnvelope />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedMessage && (
        <section className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Selected Message</h2>
              <p className="admin-card-subtitle">
                Detailed view for the currently selected contact message.
              </p>
            </div>
          </div>

          <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">From</label>
              <div>
                {selectedMessage.name} ({selectedMessage.email})
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Subject</label>
              <div>{selectedMessage.subject || 'No Subject'}</div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Message</label>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {selectedMessage.message}
              </div>
            </div>
          </div>
        </section>
      )}

      {notice && <p className="success-message">{notice}</p>}
      {error && <p className="error-message">{error}</p>}
    </>
  );
}
