# backend/courses/admin.py
from django.contrib import admin

from .models import (
    Course,
    Enrollment,
    Lesson,
    Module,
    Order,
    Review,
    Tag,
    WatchedLesson,
)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 0


class ModuleInline(admin.TabularInline):
    model = Module
    extra = 0


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "author", "price", "level", "created_at")
    list_filter = ("level", "created_at")
    search_fields = ("title", "description", "author__email", "author__name")
    filter_horizontal = ("tags",)
    inlines = (ModuleInline,)


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "course", "created_at")
    search_fields = ("title", "course__title")
    inlines = (LessonInline,)


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "module", "time_estimate", "created_at")
    search_fields = ("title", "module__title", "module__course__title")


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "course", "enrolled_at")
    search_fields = ("user__email", "course__title")
    list_filter = ("enrolled_at",)


@admin.register(WatchedLesson)
class WatchedLessonAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "lesson", "watched_at")
    search_fields = ("user__email", "lesson__title")
    list_filter = ("watched_at",)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "course", "rating", "created_at")
    search_fields = ("user__email", "course__title", "comment")
    list_filter = ("rating", "created_at")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "course", "paid", "external_payment_id", "created_at")
    search_fields = ("user__email", "course__title", "external_payment_id")
    list_filter = ("paid", "created_at")
