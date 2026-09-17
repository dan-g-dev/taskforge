#!/usr/bin/env bash
# Comprehensive smoke/regression test for the TaskForge API.
# Run against a fresh-ish backend at localhost:4000.
set -uo pipefail
BASE="http://localhost:4000"
PASS=0
FAIL=0

check() {
  local desc="$1" expected="$2" actual="$3"
  if [ "$expected" = "$actual" ]; then
    PASS=$((PASS+1))
    echo "  OK   $desc"
  else
    FAIL=$((FAIL+1))
    echo "  FAIL $desc (expected $expected, got $actual)"
  fi
}

jget() { node -pe "JSON.parse(require('fs').readFileSync(0)).$1" 2>/dev/null; }

echo "== 1. Health check =="
CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" "$BASE/api/health")
check "GET /api/health" "200" "$CODE"

echo "== 2. Demo logins =="
for role_email in admin@taskforge.io manager@taskforge.io david@taskforge.io; do
  CODE=$(curl -s -o /tmp/login_$role_email.json -w "%{http_code}" -X POST "$BASE/api/auth/login" \
    -H "Content-Type: application/json" -d "{\"email\":\"$role_email\",\"password\":\"password123\"}")
  check "login $role_email" "200" "$CODE"
done

ADMIN_TOKEN=$(cat /tmp/login_admin@taskforge.io.json | jget token)
MANAGER_TOKEN=$(cat /tmp/login_manager@taskforge.io.json | jget token)
DEV_TOKEN=$(cat /tmp/login_david@taskforge.io.json | jget token)

echo "== 3. Wrong password rejected =="
CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" -d '{"email":"admin@taskforge.io","password":"wrongpassword"}')
check "wrong password -> 401" "401" "$CODE"

echo "== 4. Registration with minimal fields (no orgName) =="
RAND=$RANDOM
CODE=$(curl -s -o /tmp/reg.json -w "%{http_code}" -X POST "$BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Test\",\"lastName\":\"User$RAND\",\"email\":\"testuser$RAND@example.com\",\"password\":\"password123\"}")
check "register without organizationName -> 201" "201" "$CODE"
NEWORG_TOKEN=$(cat /tmp/reg.json | jget token)
NEWORG_NAME=$(cat /tmp/reg.json | node -pe "JSON.parse(require('fs').readFileSync(0)).user ? 'has-user' : 'no-user'")
check "register response includes user" "has-user" "$NEWORG_NAME"

echo "== 5. Duplicate email rejected =="
CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" -X POST "$BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Dup\",\"lastName\":\"User\",\"email\":\"admin@taskforge.io\",\"password\":\"password123\"}")
check "duplicate email -> 409" "409" "$CODE"

echo "== 6. RBAC: developer cannot create project =="
CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" -X POST "$BASE/api/projects" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $DEV_TOKEN" \
  -d '{"name":"Should Fail"}')
check "developer create project -> 403" "403" "$CODE"

echo "== 7. RBAC: manager CAN create project =="
CODE=$(curl -s -o /tmp/proj.json -w "%{http_code}" -X POST "$BASE/api/projects" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $MANAGER_TOKEN" \
  -d '{"name":"QA Test Project"}')
check "manager create project -> 201" "201" "$CODE"
PROJECT_ID=$(cat /tmp/proj.json | jget project.id)
echo "     created project id=$PROJECT_ID"

echo "== 8. RBAC: developer CAN create a task in that project =="
CODE=$(curl -s -o /tmp/task.json -w "%{http_code}" -X POST "$BASE/api/tasks" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $DEV_TOKEN" \
  -d "{\"projectId\":\"$PROJECT_ID\",\"title\":\"QA task 1\"}")
check "developer create task -> 201" "201" "$CODE"
TASK_ID=$(cat /tmp/task.json | jget task.id)
echo "     created task id=$TASK_ID"

echo "== 9. RBAC: developer cannot delete project =="
CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" -X DELETE "$BASE/api/projects/$PROJECT_ID" \
  -H "Authorization: Bearer $DEV_TOKEN")
check "developer delete project -> 403" "403" "$CODE"

echo "== 10. Kanban: move task through all 4 columns =="
for status in TODO IN_PROGRESS REVIEW DONE; do
  CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" -X PATCH "$BASE/api/tasks/$TASK_ID/status" \
    -H "Content-Type: application/json" -H "Authorization: Bearer $DEV_TOKEN" \
    -d "{\"status\":\"$status\",\"position\":0}")
  check "move task to $status" "200" "$CODE"
done

echo "== 11. Invalid status rejected =="
CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" -X PATCH "$BASE/api/tasks/$TASK_ID/status" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $DEV_TOKEN" \
  -d '{"status":"BOGUS"}')
check "invalid status -> 400" "400" "$CODE"

echo "== 12. Comments: create, edit own, delete own =="
CODE=$(curl -s -o /tmp/comment.json -w "%{http_code}" -X POST "$BASE/api/tasks/$TASK_ID/comments" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $DEV_TOKEN" \
  -d '{"content":"first comment"}')
check "create comment -> 201" "201" "$CODE"
COMMENT_ID=$(cat /tmp/comment.json | jget comment.id)

CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" -X PUT "$BASE/api/comments/$COMMENT_ID" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $DEV_TOKEN" \
  -d '{"content":"edited comment"}')
check "edit own comment -> 200" "200" "$CODE"

echo "== 13. Comments: cannot edit someone else's comment =="
CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" -X PUT "$BASE/api/comments/$COMMENT_ID" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $MANAGER_TOKEN" \
  -d '{"content":"hacked"}')
check "edit others comment -> 403" "403" "$CODE"

echo "== 14. Comments: delete own comment =="
CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" -X DELETE "$BASE/api/comments/$COMMENT_ID" \
  -H "Authorization: Bearer $DEV_TOKEN")
check "delete own comment -> 200" "200" "$CODE"

echo "== 15. File upload + download + delete =="
echo "smoke test file contents" > /tmp/smoketest.txt
CODE=$(curl -s -o /tmp/attach.json -w "%{http_code}" -X POST "$BASE/api/tasks/$TASK_ID/attachments" \
  -H "Authorization: Bearer $DEV_TOKEN" -F "file=@/tmp/smoketest.txt;type=text/plain")
check "upload attachment -> 201" "201" "$CODE"
ATTACHMENT_ID=$(cat /tmp/attach.json | jget attachment.id)

CODE=$(curl -s -o /tmp/downloaded.txt -w "%{http_code}" "$BASE/api/attachments/$ATTACHMENT_ID/download" \
  -H "Authorization: Bearer $DEV_TOKEN")
check "download attachment -> 200" "200" "$CODE"
DIFF=$(diff -q /tmp/smoketest.txt /tmp/downloaded.txt >/dev/null 2>&1 && echo "same" || echo "different")
check "downloaded file matches uploaded" "same" "$DIFF"

CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" -X DELETE "$BASE/api/attachments/$ATTACHMENT_ID" \
  -H "Authorization: Bearer $DEV_TOKEN")
check "delete attachment -> 200" "200" "$CODE"

echo "== 16. Rejected file type =="
echo "fake exe" > /tmp/smoketest.exe
CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" -X POST "$BASE/api/tasks/$TASK_ID/attachments" \
  -H "Authorization: Bearer $DEV_TOKEN" -F "file=@/tmp/smoketest.exe;type=application/x-msdownload")
check "reject .exe upload -> 400" "400" "$CODE"

echo "== 17. Notifications =="
curl -s -X PUT "$BASE/api/tasks/$TASK_ID" -H "Content-Type: application/json" -H "Authorization: Bearer $MANAGER_TOKEN" \
  -d '{"assigneeId":"7"}' > /dev/null
CODE=$(curl -s -o /tmp/notif.json -w "%{http_code}" "$BASE/api/notifications" -H "Authorization: Bearer $DEV_TOKEN")
check "list notifications -> 200" "200" "$CODE"
UNREAD=$(cat /tmp/notif.json | jget unreadCount)
echo "     unread count: $UNREAD"

echo "== 18. Multi-tenant isolation =="
CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" "$BASE/api/projects/$PROJECT_ID" -H "Authorization: Bearer $NEWORG_TOKEN")
check "other org sees project -> 404" "404" "$CODE"
CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" "$BASE/api/tasks/$TASK_ID" -H "Authorization: Bearer $NEWORG_TOKEN")
check "other org sees task -> 404" "404" "$CODE"

echo "== 19. No token rejected =="
CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" "$BASE/api/dashboard")
check "no token -> 401" "401" "$CODE"

echo "== 20. Malformed token rejected =="
CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" "$BASE/api/dashboard" -H "Authorization: Bearer garbage.token.here")
check "malformed token -> 401" "401" "$CODE"

echo "== 21. Team CRUD + membership =="
CODE=$(curl -s -o /tmp/team.json -w "%{http_code}" -X POST "$BASE/api/teams" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $MANAGER_TOKEN" -d '{"name":"QA Team"}')
check "create team -> 201" "201" "$CODE"
TEAM_ID=$(cat /tmp/team.json | jget team.id)

CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" -X POST "$BASE/api/teams/$TEAM_ID/members" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $MANAGER_TOKEN" -d '{"userId":"7"}')
check "add team member -> 201" "201" "$CODE"

CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" -X DELETE "$BASE/api/teams/$TEAM_ID" -H "Authorization: Bearer $MANAGER_TOKEN")
check "delete team -> 200" "200" "$CODE"

echo "== 22. Organization admin actions =="
CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" -X PUT "$BASE/api/organization/users/7/role" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" -d '{"role":"MANAGER"}')
check "admin changes role -> 200" "200" "$CODE"
# revert
curl -s -X PUT "$BASE/api/organization/users/7/role" -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" -d '{"role":"DEVELOPER"}' > /dev/null

CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" -X PUT "$BASE/api/organization/users/7/role" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $DEV_TOKEN" -d '{"role":"ADMIN"}')
check "non-admin changes role -> 403" "403" "$CODE"

echo "== 23. Admin cannot remove self =="
CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" -X DELETE "$BASE/api/organization/users/5" -H "Authorization: Bearer $ADMIN_TOKEN")
check "admin removes self -> 400" "400" "$CODE"

echo "== 24. Dashboard + activity feed =="
CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" "$BASE/api/dashboard" -H "Authorization: Bearer $ADMIN_TOKEN")
check "GET dashboard -> 200" "200" "$CODE"
CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" "$BASE/api/activity" -H "Authorization: Bearer $ADMIN_TOKEN")
check "GET activity -> 200" "200" "$CODE"

echo "== 25. Cleanup: delete QA task and project =="
CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" -X DELETE "$BASE/api/tasks/$TASK_ID" -H "Authorization: Bearer $MANAGER_TOKEN")
check "delete task -> 200" "200" "$CODE"
CODE=$(curl -s -o /tmp/t.json -w "%{http_code}" -X DELETE "$BASE/api/projects/$PROJECT_ID" -H "Authorization: Bearer $MANAGER_TOKEN")
check "delete project -> 200" "200" "$CODE"

echo ""
echo "=================================="
echo "RESULTS: $PASS passed, $FAIL failed"
echo "=================================="
exit $FAIL
