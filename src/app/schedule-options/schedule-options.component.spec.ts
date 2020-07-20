import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ScheduleOptionsComponent } from "./schedule-options.component";

describe("ScheduleOptionsComponent", () => {
  let component: ScheduleOptionsComponent;
  let fixture: ComponentFixture<ScheduleOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleOptionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
