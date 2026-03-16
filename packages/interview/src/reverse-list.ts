type ListNode = {
  next: ListNode | null;
  val: any;
};

function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let cur = head;

  while (cur !== null) {
    const nextTmp = cur.next;
    cur.next = prev;
    prev = cur;
    cur = nextTmp;
  }

  return prev;
}
