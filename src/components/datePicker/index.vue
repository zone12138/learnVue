<!--
 * @FileDescription: 配网简报 - 特制 - 时间组件
   参考： https://github.com/zxpsuper/Demo/blob/master/code/Datepicker.vue 以此为基础进行了修改
 * @Author: xie
 * @Date: 2023-03-28 14:00:00
 -->
<template>
  <div class="date-picker" :class="readonly ? 'read-only': ''" ref="datePicker">
    <!-- el-input__inner 类名 用于表单校验 -->
    <input class="input el-input__inner" :value="modelValue" @click="openPanel" readonly placeholder="请选择时间" />
    <span class="clear-class" v-show="panelState && clearable" @click="handleClearDate">×</span>
    <!-- 动画特效 -->
    <transition name="fadeDownBig">
      <div class="date-panel" @click.stop v-show="panelState" :style="{ left: x, top: y }">
        <!-- 选择年、月 -->
        <div class="topbar">
          <span @click="leftBig">&lt;&lt;</span>
          <span @click="left">&lt;</span>
          <span class="year" @click="panelType = 'year'">{{ tmpYear }}</span>
          <span class="month" @click="panelType = 'month'">{{ changeTmpMonth }}</span>
          <span @click="right">&gt;</span>
          <span @click="rightBig">&gt;&gt;</span>
        </div>
        <!-- 年面板 -->
        <div class="type-year" v-show="panelType === 'year'">
          <ul class="year-list">
            <li v-for="(item, index) in yearList" :key="index" @click="selectYear(item)">
              <span :class="{ selected: item === tmpYear }">{{ item }}</span>
            </li>
          </ul>
        </div>
        <!-- 月面板 -->
        <div class="type-year" v-show="panelType === 'month'">
          <ul class="year-list">
            <li v-for="(item, index) in monthList" :key="index" @click="selectMonth(item)">
              <span :class="{ selected: item.value === tmpMonth }">{{ item.label }}</span>
            </li>
          </ul>
        </div>
        <!-- 日期面板 -->
        <div class="date-group" v-show="panelType === 'date'">
          <div class="week-list">
            <span v-for="(item, index) in weekList" :key="index" class="weekday">{{ item.label }}</span>
          </div>
          <ul class="date-list">
            <li
              v-for="(item, index) in dateList"
              v-text="item.value"
              :class="{
                preMonth: item.previousMonth,
                nextMonth: item.nextMonth,
                nowDate: isNowDate(item),
                invalid: isSelectedDate(item)
              }"
              :key="index"
              @click="selectDate(item)"
            ></li>
          </ul>
          <!-- 时间选择器 -->
          <div class="time-picker">
            <span>时间：</span>
            <!-- 不使用 type=number的原因是因为 e 这一个科学计数法的符号 -->
            <div class="time-input-class">
              <input
                ref="hourInput"
                v-model="hour"
                @input="handleInputHour"
                @keydown="handleKeyDown"
                :class="illegalInput ? 'red-border' : ''"
                :title="illegalInput ? '该输入框最大值为23，请按规范进行输入！' : ''"
              />
              <div class="change-date-content">
                <div class="change-date-class" @click="handleAdd('hour', 23)"></div>
                <div class="change-date-class next" @click="handleMinus('hour', 0)"></div>
              </div>
            </div>
            <div class="time-input-class">
              <input ref="minuteInput" v-model="minute" @input="handleInputMinute" @keydown="handleKeyDown" />
              <div class="change-date-content">
                <div class="change-date-class" @click="handleAdd('minute', 59)"></div>
                <div class="change-date-class next" @click="handleMinus('minute', 0)"></div>
              </div>
            </div>
            <button type="button" class="ok-class" @click="handleSelectedTime">确定</button>
            <button type="button" class="cancel-class" @click="eventListener">退出</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      x: 0,
      y: 0,
      // 今天
      today: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate()
      },
      panelState: false, // 初始值，默认panel关闭
      tmpMonth: 0, // 临时月份，可修改
      tmpYear: 0, // 临时月份，可修改
      weekList: [
        { label: '日', value: 0 },
        { label: '一', value: 1 },
        { label: '二', value: 2 },
        { label: '三', value: 3 },
        { label: '四', value: 4 },
        { label: '五', value: 5 },
        { label: '六', value: 6 }
      ], // 周
      monthList: [
        { label: '一月', value: 0 },
        { label: '二月', value: 1 },
        { label: '三月', value: 2 },
        { label: '四月', value: 3 },
        { label: '五月', value: 4 },
        { label: '六月', value: 5 },
        { label: '七月', value: 6 },
        { label: '八月', value: 7 },
        { label: '九月', value: 8 },
        { label: '十月', value: 9 },
        { label: '十一月', value: 10 },
        { label: '十二月', value: 11 }
      ], // 月
      isFirst: true, // 第一次打开面板
      illegalInput: false, // 输入的小时，是否非法
      nowValue: null, // 当前选中日期
      panelType: 'date', // 面板状态
      hour: '', // 小时
      minute: '' // 分钟
    }
  },
  props: {
    // 值
    modelValue: {
      type: [Date, String],
      default: ''
    },
    // 格式
    format: {
      type: String,
      default: 'yyyy-MM-dd hh:mm'
    },
    // 是否可以清除
    clearable: {
      type: Boolean,
      default: true
    },
    positionX: {
      type: String,
      default: 'left'
    },
    // 是否默认当天
    defaultToday: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    /**
     * @description 日期列表
     */
    dateList() {
      //获取当月的天数
      let currentMonthLength = new Date(this.tmpYear, this.tmpMonth + 1, 0).getDate()
      const year = this.tmpYear,
        month = this.tmpMonth + 1
      //先将当月的日期塞入dateList
      let dateList = Array.from({ length: currentMonthLength }, (val, index) => {
        return {
          year,
          month,
          currentMonth: true,
          value: index + 1
        }
      })
      // 获取当月1号的星期是为了确定在1号前需要插多少天
      let startDay = new Date(this.tmpYear, this.tmpMonth, 1).getDay()
      // 确认上个月一共多少天
      let previousMongthLength = new Date(this.tmpYear, this.tmpMonth, 0).getDate()
      // 在1号前插入上个月日期
      for (let i = 0, len = startDay; i < len; i++) {
        dateList = [{ year, month: month - 1, previousMonth: true, value: previousMongthLength - i }].concat(dateList)
      }
      // 补全剩余位置
      for (let i = 1, item = 1; i < 15; i++, item++) {
        dateList[dateList.length] = { year, month: month + 1, nextMonth: true, value: i }
      }
      return dateList
    },
    /**
     * @description 改变月份
     */
    changeTmpMonth() {
      return this.monthList[this.tmpMonth].label
    },
    /**
     * @description 年列表
     */
    yearList() {
      return Array.from({ length: 12 }, (value, index) => this.tmpYear + index)
    }
  },
  watch: {
    panelState: {
      handler(val) {
        if (val) {
          // 暂时想不到优化，后续有空可考虑单例模式
          setTimeout(() => {
            window.addEventListener('click', this.eventListener)
            window.addEventListener('DOMMouseScroll', this.eventListener)
            window.addEventListener('mousewheel', this.eventListener)
          }, 400)
        } else {
          window.removeEventListener('click', this.eventListener)
          window.removeEventListener('DOMMouseScroll', this.eventListener)
          window.removeEventListener('mousewheel', this.eventListener)
        }
      },
      immediate: false
    }
  },
  mounted() {
    console.log(this.modelValue)
  },
  methods: {
    /**
     * @description 打开日期时间选择器
     */
    openPanel() {
      // 设置只读时，禁止弹窗日期面板
      if (this.readonly) return
      this.calcPosition()
      this.panelState = !this.panelState
      this.nowValue = this.defaultToday ? null : this.modelValue
      this.illegalInput = false
      this.panelType = 'date'
      // 赋值
      this.tmpYear = this.modelValue ? new Date(this.modelValue).getFullYear() : new Date().getFullYear()
      this.tmpMonth = this.modelValue ? new Date(this.modelValue).getMonth() : new Date().getMonth()
      // 判断输入框是否有值，有值则拿输入框的时分，没有值则拿当前时分
      const time = new Date(this.modelValue || new Date())
      this.hour = time.getHours()
      this.minute = time.getMinutes()

      this.$nextTick(() => {
        this.$refs.hourInput && this.$refs.hourInput.focus()
        this.$refs.hourInput.selectionStart = 0
        this.$refs.hourInput.selectionEnd = 0
      })
    },
    /**
     * @description 清除时间
     */
    handleClearDate() {
      this.$emit('input', '')
      this.$emit('change', '')
      this.panelState = false
    },
    /**
     * @description 计算显示的位置
     */
    calcPosition() {
      const domRect = this.$refs.datePicker.getBoundingClientRect()
      const bodyDom = document.body.getBoundingClientRect()
      let height = domRect.y + domRect.height
      let width = domRect.x
      if (height + 280 > bodyDom.height) {
        height = domRect.y - 280
      }
      if (width + 290 > bodyDom.width) {
        width = bodyDom.width - 290
      }
      this.y = height + 'px'
      this.x = width + 'px'
      console.log(this.y, this.x, domRect, bodyDom)
    },
    /**
     * @description 左边的小箭头（年面板显示时，上一年；其余情况，上个月
     */
    left() {
      if (this.panelType === 'year') this.tmpYear--
      else {
        if (this.tmpMonth === 0) {
          this.tmpYear--
          this.tmpMonth = 11
        } else this.tmpMonth--
      }
    },
    /**
     * @description 左边的大箭头（年面板时，显示之前的12年；其余情况，上一年
     */
    leftBig() {
      if (this.panelType === 'year') this.tmpYear -= 12
      else this.tmpYear--
    },
    /**
     * @description 右边的小箭头（年面板显示时，下一年；其余情况，下个月
     */
    right() {
      if (this.panelType === 'year') this.tmpYear++
      else {
        if (this.tmpMonth === 11) {
          this.tmpYear++
          this.tmpMonth = 0
        } else this.tmpMonth++
      }
    },
    /**
     * @description 右边的大箭头（年面板时，显示之后的12年；其余情况，下一年
     */
    rightBig() {
      if (this.panelType === 'year') this.tmpYear += 12
      else this.tmpYear++
    },
    /**
     * @description 隐藏/收起日期时间组件
     */
    eventListener() {
      this.panelState = false
    },
    /**
     * @description 验证当天 border包裹
     * @param { Object } item 日期信息
     */
    isNowDate(item) {
      return this.today.date == item.value && this.today.month == item.month && this.today.year == item.year
    },
    /**
     * @description 验证是不是传进来的时间，或者选中的时间，高亮
     * @param { Object } item 日期信息
     */
    isSelectedDate(item) {
      const time = new Date(this.nowValue || this.modelValue)
      return time && time.getDate() == item.value && time.getMonth() + 1 == item.month && time.getFullYear() == item.year
    },
    /**
     * @description 选择日期
     * @param { String } item 选择的日期
     */
    selectDate(item) {
      this.nowValue = `${item.year}-${item.month}-${item.value}`
      if (item.previousMonth) this.tmpMonth--
      if (item.nextMonth) this.tmpMonth++
      this.$nextTick(() => {
        this.$refs.hourInput && this.$refs.hourInput.focus()
        this.$refs.hourInput.selectionStart = 0
        this.$refs.hourInput.selectionEnd = 0
      })
    },
    /**
     * @description 选择年份（选择年份后，自动显示月份面板
     * @param { String } item 选择的年份
     */
    selectYear(item) {
      this.tmpYear = item
      this.panelType = 'month'
    },
    /**
     * @description 选择月份（选择月份后，自动显示日期面板
     * @param { String } item 选择的月份
     */
    selectMonth(item) {
      this.tmpMonth = item.value
      this.panelType = 'date'
    },
    /**
     * @description 格式化
     * @param { String | Number } date 日期或者时间戳
     * @param { String } fmt 日期格式
     */
    formatDate(date, fmt = this.format) {
      // 长度为10的时候末尾补3个0
      if (date === null || date === 'null') {
        return '--'
      }
      date = new Date(Number(date))
      var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt))
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      }
      return fmt
    },
    /**
     * @description 按下键盘时, 只能输入 0-9 和删除键
     */
    handleKeyDown(event) {
      const { key } = event
      if (key == 'Enter') this.handleSelectedTime()
      // 只接受数字和删除键
      event.returnValue = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace'].includes(key)
    },
    /**
     * @description 时间输入 - 小时（验证）
     */
    handleInputHour() {
      // 1.去掉非数字(handleKeyDown处理了)
      // 2. 第一位只能是 0,1,2
      let cursorPosition = this.$refs.hourInput.selectionStart
      if (/^[3-9]/.test(this.hour)) {
        this.hour = this.hour.replace(/^[3-9]/, '')
        cursorPosition = 0
      }
      // 3. 如果第一位是2时，后一位不能超过4
      // 其实就是00-23小时，不会写长的正则表达式，只能这么拆了（悲
      if (/^2[4-9]+/.test(this.hour)) {
        this.hour = this.hour.replace(/[4-9]$/, '')
        cursorPosition = 1
      }
      // 光标位置
      if (cursorPosition <= 2 && this.hour.length > 2) {
        const suffix = cursorPosition == 2 ? '' : this.hour.substr(cursorPosition + 1, 2)
        this.hour = this.hour.substr(0, cursorPosition) + suffix
        // 解决重新赋值后，光标会移动到最后面的问题
        // 验证小时的非法输入，原本是通过上面的 /^2/.test 进行校验把大于3的数去掉的的，但为了保持和旧系统一致，就这样处理了
        this.illegalInput = Number(this.hour) > 23
      }
      if (this.hour.length > 2) {
        this.hour = this.hour.substr(0, 2)
        cursorPosition = 2
      }
      // 移动光标
      this.handleMoveCursorPosition('hourInput', cursorPosition)
      // 光标到最后时（也就是输入了俩位数字时，自动跳到分钟输入框
      if (cursorPosition == 2) {
        this.illegalInput = Number(this.hour) > 23
        this.$refs.minuteInput && this.$refs.minuteInput.focus()
        this.handleMoveCursorPosition('minuteInput', 0)
      }
    },
    /**
     * @description 时间输入 - 分钟（验证）
     */
    handleInputMinute() {
      // 1.去掉非数字(handleKeyDown处理了)
      // 2. 第一位只能是 0,1,2,3,4,5
      let cursorPosition = this.$refs.minuteInput.selectionStart
      if (/^[6-9]/.test(this.minute)) {
        this.minute = this.minute.replace(/^[6-9]/g, '')
        cursorPosition = 0
      }
      // 光标位置
      if (cursorPosition <= 2 && this.minute.length > 2) {
        const suffix = cursorPosition == 2 ? '' : this.minute.substr(cursorPosition + 1, 2)
        this.minute = this.minute.substr(0, cursorPosition) + suffix
      }
      if (this.minute.length > 2) {
        this.minute = this.minute.substr(0, 2)
        cursorPosition = 2
      }
      // 移动光标
      this.handleMoveCursorPosition('minuteInput', cursorPosition)
    },
    /**
     * @description 移动光标位置
     * @param { String } refName 组件名
     * @param { Number } num 位置索引
     */
    handleMoveCursorPosition(refName, num) {
      this.$nextTick(() => {
        this.$refs[refName].selectionStart = num
        this.$refs[refName].selectionEnd = num
      })
    },
    /**
     * @description 点击向上（增加）按钮触发
     * @param { String } name 需要增加的字段
     * @param { Number } max 最大值限制
     */
    handleAdd(name, max) {
      if (Number(this[name]) < max) {
        this[name] = Number(this[name]) + 1 + ''
      }
    },
    /**
     * @description 点击向上（增加）按钮触发
     * @param { String } name 需要增加的字段
     * @param { Number } min 最大值限制
     */
    handleMinus(name, min) {
      if (Number(this[name]) > min) {
        this[name] = Number(this[name]) - 1 + ''
      }
    },
    /**
     * @description 点击确认按钮触发
     */
    handleSelectedTime() {
      if (this.illegalInput) {
        this.$message.warning('小时输入框最大值为23，请按规范进行填写！')
        return
      }
      const year = this.nowValue ? new Date(this.nowValue).getFullYear() : this.today.year
      const month = this.nowValue ? new Date(this.nowValue).getMonth() + 1 : this.today.month
      const date = this.nowValue ? new Date(this.nowValue).getDate() : this.today.date
      let selectDay = new Date(year, month - 1, date, this.hour, this.minute)
      this.panelState = !this.panelState
      // console.log(selectDay)
      this.$emit('update:modelValue', this.formatDate(selectDay.getTime()))
      this.$emit('change', this.formatDate(selectDay.getTime()))
      console.log(this.value)
    }
  },
  // 销毁时移除点击事件
  destroyed() {
    window.removeEventListener('click', this.eventListener)
    window.removeEventListener('DOMMouseScroll', this.eventListener)
    window.removeEventListener('mousewheel', this.eventListener)
  }
}
</script>
<style lang="scss" scoped>
.date-picker {
  // min-width: 210px;
  width: 100%;
  text-align: center;
  border-radius: 5px;
  position: relative;
  font-family: PingFang SC, Microsoft YaHei;
  background: rgba(255, 255, 255, 0.64);
  display: inline-block;
  &.read-only {
    input {
      cursor: not-allowed;
    }
  }
  input {
    display: inline-block;
    box-sizing: border-box;
    width: 100%;
    height: 32px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 14px;
    border: 1px solid #fff;
    border-radius: 4px;
    background-color: #fff;
    position: relative;
    outline: 0;
    cursor: text;
    color: #3b5f8d;
    transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    &.input {
      background: url('./images/date.png') center center no-repeat !important;
      background-position-x: 4px !important;
      padding-right: 10px;
      padding-left: 26px;
    }
  }
  .clear-class {
    position: absolute;
    right: 8px;
    color: #aaa;
    cursor: pointer;
    top: 50%;
    transform: translateY(-50%);
  }
  // 主体面板
  .date-panel {
    width: 290px;
    box-shadow: 0 0 8px #ccc;
    background: #fff;
    position: fixed;
    z-index: 99999;
    font-size: 14px;
    font-family: PingFang SC, Microsoft YaHei;
    line-height: 1.15;
    .topbar {
      background: #448cf7;
      height: 38px;
      line-height: 38px;
      span {
        display: inline-block;
        width: 22px;
        color: #fff;
        cursor: pointer;
        &:hover {
          color: #81bbf8;
        }
      }
      .year,
      .month {
        width: 60px;
      }
    }
    // 时间选择
    .time-picker {
      display: flex;
      padding: 4px 8px;
      background: #ebf3ff;
      align-items: center;
      input {
        width: 40px;
        outline: 0;
        border: 1px solid #89a1c2;
        border-right: none;
        &.red-border {
          border-color: red;
        }
      }
      button {
        color: #fff;
        font-family: PingFangSC, sans-serif;
        border-radius: 2px 2px 2px 2px;
        opacity: 1;
        border: 1px solid #3485ff;
        padding: 8px;
        cursor: pointer;
        &.ok-class {
          background: linear-gradient(180deg, #6aa6ff 0%, #2a71da 100%);
          margin-right: 10px;
        }
        &.cancel-class {
          background: #fff;
          color: #3485ff;
        }
      }
      .time-input-class {
        display: flex;
        &:last-of-type {
          margin-right: 10px;
        }
        .change-date-content {
          width: 16px;
          .change-date-class {
            height: 16px;
            width: 100%;
            background: url('./images/changenumber.png') center center;
            background-size: 100% 100%;
            border: 1px solid #89a1c2;
            border-radius: 2px;
            cursor: pointer;
            &.next {
              transform: rotate(180deg);
              border-bottom: none;
            }
          }
        }
      }
    }
  }
}

.year-list {
  .selected {
    background: #2d8cf0;
    border-radius: 4px;
    color: #fff;
  }
  li {
    display: inline-block;
    width: 70px;
    height: 50px;
    line-height: 50px;
    border-radius: 10px;
    cursor: pointer;
  }
  span {
    display: inline-block;
    line-height: 16px;
    padding: 8px;
    &:hover {
      background: #e1f0fe;
    }
  }
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.date-group {
  width: 100%;
  font-size: 14px;
  .week-list {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    background: #d1e3ff;
    color: #1a376b;
    height: 28px;
    line-height: 28px;
    .weekday {
      display: inline-block;
      width: calc(100% / 7);
      text-align: center;
    }
  }
  .date-list {
    width: 100%;
    text-align: center;
    height: 168px;
    overflow: hidden;
    margin-top: 4px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    li {
      display: inline-block;
      width: calc(100% / 7);
      height: 28px;
      line-height: 28px;
      text-align: center;
      cursor: pointer;
      color: #000;
      border: 1px solid #fff;
      border-radius: 4px;
      &:hover {
        background: #e1f0fe;
      }
      // 当天
      &.nowDate {
        border: 1px solid #2d8cf0;
      }
      // 选中项或者传值的时间
      &.invalid {
        background: #2d8cf0;
        color: #fff;
      }
    }
    .selected {
      border: 1px solid #2d8cf0;
    }
    .invalid {
      background: #2d8cf0;
      color: #fff;
    }
    .preMonth,
    .nextMonth {
      color: #c5c8ce;
    }
  }
}

.fadeDownBig-enter-active,
.fadeDownBig-leave-active,
.fadeInDownBig {
  animation-duration: 0.5s;
  animation-fill-mode: both;
}
.fadeDownBig-enter-active {
  animation-name: fadeInDownBig;
}
.fadeDownBig-leave-active {
  animation-name: fadeOutDownBig;
}
@keyframes fadeInDownBig {
  from {
    opacity: 0.8;
    -webkit-transform: translate3d(0, -4px, 0);
    transform: translate3d(0, -4px, 0);
  }
  to {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}
@keyframes fadeOutDownBig {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
