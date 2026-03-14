<template>
  <div class="activity-feed">
    <!-- Feed Header -->
    <div class="feed-header">
      <h2>Recent Activities</h2>
      <p class="feed-subtitle">Stay updated with the latest posts</p>
    </div>

    <!-- Activities List -->
    <div class="activities-list" v-if="activities.length > 0">
      <ActivityCard 
        v-for="activity in activities" 
        :key="activity._id || activity.id" 
        :activity="activity"
        @card-click="handleCardClick"
      />
      
      <!-- Sentinel element for intersection observer -->
      <div ref="sentinelEl" class="scroll-sentinel"></div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !hasMore && activities.length === 0" class="empty-state section-card">
      <div class="empty-icon">📭</div>
      <p>No activities yet</p>
      <button @click="refreshFeed" class="action-btn primary">Refresh Feed</button>
    </div>

    <!-- Loading Skeleton during initial load -->
    <div v-if="loading && activities.length === 0" class="skeleton-container">
      <div class="skeleton-card" v-for="n in 5" :key="n">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text short"></div>
        </div>
      </div>
    </div>

    <!-- Loading Spinner for subsequent loads -->
    <div v-if="loading && hasMore && activities.length > 0" class="spinner-wrapper">
      <div class="spinner"></div>
      <span class="loading-text">Loading more activities...</span>
    </div>

    <!-- End of Feed Message -->
    <div v-if="!hasMore && activities.length > 0" class="end-message">
      <span>🎉 You've reached the end!</span>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state section-card">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button @click="refreshFeed" class="action-btn danger">Try Again</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ActivityCard from './ActivityCard.vue';

export default {
  name: 'ActivityFeed',
  components: {
    ActivityCard
  },
  data() {
    return {
      activities: [],
      loading: false,
      hasMore: true,
      lastId: null,
      error: null,
      sentinelEl: null,
      isFetching: false,
      observer: null
    };
  },
  computed: {
    getQueryParams() {
      return this.lastId ? `?lastId=${encodeURIComponent(this.lastId)}&limit=10` : '?limit=10';
    }
  },
  mounted() {
    this.fetchActivities();
    this.$nextTick(() => {
      this.setupIntersectionObserver();
    });
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    async fetchActivities() {
      if (this.isFetching || (!this.hasMore && this.activities.length > 0)) {
        return;
      }

      this.isFetching = true;
      this.loading = true;
      this.error = null;

      try {
        const API_PORT = process.env.VUE_APP_API_PORT || 3000;
        const response = await axios.get(`http://localhost:${API_PORT}/api/feed${this.getQueryParams}`);

        if (response.data) {
          const newActivities = response.data.data;
          const pagination = response.data.pagination || {};

          // If lastId exists, we're appending (load more), otherwise replacing
          if (this.lastId) {
            this.activities = [...this.activities, ...newActivities];
          } else {
            this.activities = newActivities;
          }

          // Update cursor for next page
          if (pagination.nextCursor) {
            this.lastId = pagination.nextCursor;
          }

          // Determine if there are more items
          this.hasMore = pagination.hasMore !== undefined ? pagination.hasMore : newActivities.length >= 10;
        }
      } catch (err) {
        console.error('Error fetching feed:', err);
        this.error = 'Failed to load activities. Please try again.';
      } finally {
        this.loading = false;
        this.isFetching = false;
      }
    },

    setupIntersectionObserver() {
      const sentinel = this.$refs.sentinelEl;
      if (!sentinel) {
        setTimeout(() => this.setupIntersectionObserver(), 100);
        return;
      }

      const options = {
        root: null,
        rootMargin: '100px',
        threshold: 0
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && this.hasMore && !this.isFetching) {
            this.fetchActivities();
          }
        });
      }, options);

      this.observer.observe(sentinel);
    },

    refreshFeed() {
      this.activities = [];
      this.lastId = null;
      this.hasMore = true;
      this.error = null;
      this.fetchActivities();
    },

    handleCardClick(activity) {
      this.$emit('notification', `Opened: ${activity.title}`);
    }
  }
};
</script>

<style scoped>
.activity-feed {
  min-height: calc(100vh - 120px);
  padding-bottom: 40px;
}

.feed-header {
  margin-bottom: 30px;
  text-align: center;
}

.feed-header h2 {
  font-size: 28px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.feed-subtitle {
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  margin: 0;
}

/* Section Card */
.section-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  text-align: center;
}

/* Empty State */
.empty-state {
  max-width: 400px;
  margin: 40px auto;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 18px;
  margin: 0 0 16px 0;
  color: #666;
}

/* Error State */
.error-state {
  max-width: 400px;
  margin: 40px auto;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.error-state p {
  font-size: 18px;
  margin: 0 0 16px 0;
  color: #e74c3c;
}

/* Action Buttons */
.action-btn {
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.action-btn.danger {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

.action-btn.danger:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(231, 76, 60, 0.5);
}

/* Skeleton Loading */
.skeleton-container {
  padding: 0;
}

.skeleton-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.skeleton-image {
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-content {
  padding: 20px;
}

.skeleton-title {
  height: 24px;
  width: 70%;
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
  margin-bottom: 16px;
}

.skeleton-text {
  height: 16px;
  width: 100%;
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
  margin-bottom: 12px;
}

.skeleton-text.short {
  width: 40%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Spinner */
.spinner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-top: 4px solid #667eea;
  border-right: 4px solid #f093fb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.loading-text {
  margin-top: 12px;
  color: #fff;
  font-size: 14px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* End of Feed */
.end-message {
  text-align: center;
  padding: 30px;
  color: #42b983;
  font-size: 16px;
  background: rgba(255,255,255,0.9);
  border-radius: 12px;
  margin-top: 20px;
}

/* Scroll Sentinel */
.scroll-sentinel {
  height: 1px;
  width: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .activity-feed {
    padding: 15px;
  }

  .feed-header h2 {
    font-size: 24px;
  }

  .skeleton-image {
    height: 150px;
  }
}

@media (max-width: 480px) {
  .feed-header h2 {
    font-size: 22px;
  }

  .feed-subtitle {
    font-size: 13px;
  }
}
</style>


