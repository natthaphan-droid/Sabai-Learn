import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mathCurriculum } from '../src/data/curriculum.js';
import { subjectCourses, getDashboardCourses, assignmentsByGrade, allAssignments } from '../src/data/platform.js';
import { materials } from '../src/data/materials.js';

const chapters = Object.values(mathCurriculum).flatMap(grade => Object.values(grade).flat());
assert.equal(new Set(chapters.map(chapter => chapter.id)).size, chapters.length, 'Chapter IDs must be unique');
assert.equal(new Set(allAssignments.map(task => task.id)).size, allAssignments.length, 'Assignment IDs must be unique');

for (const grade of ['m4', 'm5', 'm6']) {
  const courses = getDashboardCourses(grade);
  assert.equal(courses.length, 4);
  for (const course of courses) {
    const expectedRoute = chapters.some(chapter => chapter.id === course.id) ? `/courses/${course.id}` : `/subjects/${course.id}`;
    assert.equal(course.to, expectedRoute, `Broken course link: ${course.id}`);
    assert.ok(chapters.some(chapter => chapter.id === course.id) || subjectCourses.some(subject => subject.id === course.id));
    assert.equal(course.progress, Math.round(course.completed / course.lessons * 100), `Inconsistent progress: ${course.id}`);
  }
  assert.ok(assignmentsByGrade[grade].some(task => task.status === 'pending'));
  assert.ok(materials.some(material => material.grade === grade));
}

for (const chapter of chapters) {
  assert.equal(new Set(chapter.topics.map(topic => topic.id)).size, chapter.topics.length, `Duplicate topic route in ${chapter.id}`);
}

for (const task of allAssignments) {
  assert.ok(Number.isFinite(Date.parse(task.deadline)), `Invalid deadline: ${task.id}`);
  assert.ok(['pending', 'completed'].includes(task.status));
  if (task.status === 'completed') assert.ok(task.score >= 0 && task.score <= task.maxScore);
}

for (const material of materials) {
  const file = readFileSync(new URL(`../public/materials/${material.id}.txt`, import.meta.url), 'utf8');
  assert.ok(file.includes(material.title) && file.includes(material.content), `Missing or outdated download: ${material.id}`);
}
console.log(`Verified ${chapters.length} chapter routes, ${allAssignments.length} assignments, and ${materials.length} downloadable documents across all grades.`);
