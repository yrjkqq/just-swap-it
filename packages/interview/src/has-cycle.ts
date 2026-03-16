import { ListNode } from "./type";

function hasCycle(head: ListNode | null): boolean {
  let fast: ListNode | null = head;
  let slow: ListNode | null = head;

  while (slow !== null) {
    slow = slow.next;
    fast = fast?.next?.next ?? null;
    if (slow === fast) {
      return true;
    }
  }

  return false;
}
