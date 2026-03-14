<template>
  <div class="activity-card" @click="handleClick">
    <img 
      v-if="activity.imageUrl" 
      :src="activity.imageUrl" 
      :alt="activity.title"
      class="card-image"
      loading="lazy"
    />
    <div class="card-content">
      <h3 class="card-title">{{ activity.title }}</h3>
      <p class="card-description">{{ activity.description }}</p>
      <div class="card-footer">
        <span class="card-date">{{ formattedDate }}</span>
        <button class="like-btn" @click.stop="toggleLike">
          <span>{{ liked ? '❤️' : '🤍' }}</span>
          <span class="like-count">{{ likeCount }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityCard',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      liked: false,
      likeCount: Math.floor(Math.random() * 50) + 1
    };
  },
  computed: {
    formattedDate() {
      const date = new Date(this.activity.createdAt);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  methods: {
    handleClick() {
      this.$emit('card-click', this.activity);
    },
    toggleLike() {
      this.liked = !this.liked;
      this.likeCount += this.liked ? 1 : -1;
    }
  }
};
</script>

<style scoped>
.activity-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 24px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.activity-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.25), 0 8px 16px rgba(102, 126, 234, 0.15);
}

.card-image {
  width: 100%;
  height: auto;
  max-height: 220px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.activity-card:hover .card-image {
  transform: scale(1.05);
}

.card-content {
  padding: 20px;
}

.card-title {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.card-description {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-date {
  color: #999;
  font-size: 12px;
  display: inline-block;
  padding: 4px 10px;
  background: #f5f7fa;
  border-radius: 20px;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
  font-size: 14px;
}

.like-btn:hover {
  background: #f5f7fa;
  transform: scale(1.1);
}

.like-count {
  color: #666;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .card-image {
    max-height: 180px;
  }

  .card-content {
    padding: 16px;
  }

  .card-title {
    font-size: 16px;
  }

  .card-description {
    font-size: 13px;
    -webkit-line-clamp: 2;
  }
}

@media (max-width: 480px) {
  .card-image {
    max-height: 150px;
  }

  .card-content {
    padding: 14px;
  }

  .card-title {
    font-size: 15px;
  }

  .card-description {
    font-size: 12px;
  }

  .activity-card {
    border-radius: 8px;
    margin-bottom: 16px;
  }
}
</style>


